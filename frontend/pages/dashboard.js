import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
   getSummary,
   getRecords,
   deleteRecord,
   logoutUser
} from '../utils/api';

import SummaryCard from '../components/SummaryCard';
import RecordForm from '../components/RecordForm';
import styles from '../styles/dashboard.module.css';

import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   LineElement,
   PointElement,
   Title,
   Tooltip,
   Legend,
   ArcElement
} from 'chart.js';

import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(
   CategoryScale,
   LinearScale,
   LineElement,
   PointElement,
   Title,
   Tooltip,
   Legend,
   ArcElement
);

export default function Dashboard()
{
   const router = useRouter();

   const [summary, setSummary] = useState(null);
   const [records, setRecords] = useState([]);
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(true);
   const [showDropdown, setShowDropdown] = useState(false);
   const [startDate, setStartDate] = useState('');
   const [endDate, setEndDate] = useState('');

   const addRef = useRef(null);
   const summaryRef = useRef(null);
   const transactionsRef = useRef(null);
   const recordsRef = useRef(null);
   const usersRef = useRef(null);

   const scrollToSection = (ref) => {
      if (ref?.current) {
         ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
         });
      }
   };

   const [role, setRole] = useState(null);
   const [username, setUsername] = useState('');
   const [mounted, setMounted] = useState(false);

   const [search, setSearch] = useState('');
   const [typeFilter, setTypeFilter] = useState('');
   const [categoryFilter, setCategoryFilter] = useState('');

   const [page, setPage] = useState(1);
   const [editingRecord, setEditingRecord] = useState(null);

   const isAdmin = role === 'ADMIN';
   const canCreate = role === 'ANALYST' || role === 'ADMIN';
   const canViewCharts = role !== 'VIEWER';
   const canDelete = role === 'ADMIN' || role === 'ANALYST';

   const fetchData = async (currentPage = 1, append = false) =>
   {
      try
      {
         setLoading(true);

         const [summaryRes, recordsRes] = await Promise.all([
            getSummary(),
            getRecords({
               page: currentPage,
               limit: 10,
               search,
               type: typeFilter,
               category: categoryFilter,
               startDate,
               endDate
            })
         ]);

         if (summaryRes.data) setSummary(summaryRes.data);

         if (recordsRes.records)
         {
            if (append)
            {
               setRecords(prev => [...prev, ...recordsRes.records]);
            }
            else
            {
               setRecords(recordsRes.records);
            }
         }
      }
      catch (error)
      {
         setError(error.message || 'Something went wrong');
      }
      finally
      {
         setLoading(false);
      }
   };

   useEffect(() =>
   {
      setMounted(true);

      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');
      const name = localStorage.getItem('name');

      if (!token)
      {
         router.push('/login');
         return;
      }

      setRole(userRole);
      setUsername(name || 'User');

      fetchData(1);
   }, []);

   if (!mounted) return null;

   const handleLogout = () =>
   {
      logoutUser();
      router.push('/login');
   };

   const handleDelete = async (id) =>
   {
      try
      {
         await deleteRecord(id);
         fetchData(1);
      }
      catch (error)
      {
         alert('Not allowed to delete this record');
      }
   };

   const loadMore = async () =>
   {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchData(nextPage, true);
   };

   const categoryData = summary?.categoryTotals || [];

   const sorted = [...categoryData].sort((a, b) => b.total - a.total);
   const top = sorted.slice(0, 5);
   const others = sorted.slice(5);

   if (others.length)
   {
      top.push({
         category: 'Others',
         total: others.reduce((sum, i) => sum + i.total, 0)
      });
   }

   const categoryChartData =
   {
      labels: top.map(c => c.category),
      datasets: [
         {
            data: top.map(c => c.total),
            backgroundColor: [
               '#4f46e5',
               '#22c55e',
               '#ef4444',
               '#f59e0b',
               '#06b6d4',
               '#6b7280'
            ],
            borderWidth: 0
         }
      ]
   };

   const trendData = summary?.monthlyTrends || [];
   const grouped = {};

   trendData.forEach(item =>
   {
      const key = `${item.month}/${item.year}`;
      if (!grouped[key]) grouped[key] = { income: 0, expense: 0 };
      grouped[key][item.type] += item.total;
   });

   const labels = Object.keys(grouped);

   const trendChartData =
   {
      labels,
      datasets: [
         {
            label: 'Income',
            data: labels.map(l => grouped[l].income),
            borderColor: '#22c55e',
            backgroundColor: '#22c55e',
            tension: 0.4
         },
         {
            label: 'Expense',
            data: labels.map(l => grouped[l].expense),
            borderColor: '#ef4444',
            backgroundColor: '#ef4444',
            tension: 0.4
         }
      ]
   };

   return (
      <>
         <Head>
            <title>{username ? `${username} | ${role}` : 'Dashboard'}</title>
         </Head>

         <div className={styles.container}>

            <div className={styles.header}>
               <div>
                  <h2 style={{ fontSize: '28px', fontWeight: '700' }}>
                     {username}&apos;s Dashboard
                  </h2>
                  <p style={{ marginTop: '4px', fontSize: '12px', color: '#9ca3af', letterSpacing: '1px' }}>
                     {role}
                  </p>
               </div>

               <div className={styles.actions}>
                  {isAdmin && (
                     <button onClick={() => router.push('/admin')}>
                        Admin Panel
                     </button>
                  )}

                  <div className={styles.profileWrapper}>
                        <button onClick={() => setShowDropdown(prev => !prev)}>
                           Profile 
                        </button>

                        {showDropdown && (
                           <div className={styles.dropdown}>
                              <button onClick={() => router.push('/profile')}>
                                 Manage Account
                              </button>

                              <button onClick={handleLogout}>
                                 Logout
                              </button>
                           </div>
                        )}
                  </div>
               </div>
            </div>

            <div className={styles.navbar}>
               <button onClick={() => scrollToSection(summaryRef)}>Summary</button>
               {canViewCharts && (<button onClick={() => scrollToSection(transactionsRef)}>Transactions</button> )}
               <button onClick={() => scrollToSection(recordsRef)}>Records</button>
               {canViewCharts && (<button onClick={() => scrollToSection(transactionsRef)}>Trends</button>)}
               {canCreate && (<button onClick={() => scrollToSection(addRef)}>Add</button>)}
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {summary && !loading && (
               <>
                  <div ref={summaryRef} className={styles.cardGrid}>
                     <SummaryCard label="Total Income" value={`$${summary.overview.income}`} />
                     <SummaryCard label="Total Expense" value={`$${summary.overview.expense}`} />
                     <SummaryCard label="Net Balance" value={`$${summary.overview.netBalance}`} />
                  </div>

                  {canViewCharts && (
                     <div ref={transactionsRef}>
                        <h3 className={styles.sectionTitle}>Category Distribution</h3>
                        <div className={`${styles.chartBox} ${styles.pieBox}`}>
                           <Pie
                              data={categoryChartData}
                              options={{
                                 maintainAspectRatio: false,
                                 cutout: '65%',
                                 plugins:
                                 {
                                    legend:
                                    {
                                       position: 'bottom',
                                       labels:
                                       {
                                          color: '#9ca3af',
                                          padding: 16,
                                          boxWidth: 12
                                       }
                                    }
                                 }
                              }}
                           />
                        </div>

                        <h3 className={styles.sectionTitle}>Monthly Trends</h3>
                        <div className={`${styles.chartBox} ${styles.lineBox}`}>
                           <Line
                              data={trendChartData}
                              options={{
                                 maintainAspectRatio: false,
                                 plugins:
                                 {
                                    legend:
                                    {
                                       labels:
                                       {
                                          color: '#9ca3af'
                                       }
                                    }
                                 },
                                 scales:
                                 {
                                    x:
                                    {
                                       ticks: { color: '#9ca3af' },
                                       grid: { color: 'rgba(255,255,255,0.05)' }
                                    },
                                    y:
                                    {
                                       ticks: { color: '#9ca3af' },
                                       grid: { color: 'rgba(255,255,255,0.05)' }
                                    }
                                 }
                              }}
                           />
                        </div>
                     </div>
                  )}
                  
                  <div className={styles.filters}>
                     <input
                        className={styles.input}
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                     />

                     <input
                        className={`${styles.input} ${styles.dateInput}`}
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                     />

                     <input
                        className={`${styles.input} ${styles.dateInput}`}
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                     />

                     <select
                        className={styles.select}
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                     >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                     </select>

                     <input
                        className={styles.input}
                        placeholder="Category..."
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                     />

                     <button onClick={() => fetchData(1)}>
                        Apply
                     </button>

                     <button
                        onClick={() =>
                        {
                           setSearch('');
                           setTypeFilter('');
                           setCategoryFilter('');
                           setStartDate('');
                           setEndDate('');
                           fetchData(1);
                        }}
                     >
                        Reset
                     </button>
                  </div>

                  <h3 ref={recordsRef} className={styles.sectionTitle}>All Records</h3>

                  <div className={styles.tableWrapper}>
                     <table className={styles.table}>
                        <thead>
                           <tr>
                              <th>Category</th>
                              {role !== 'VIEWER' && <th>Created By</th>}
                              <th>Amount</th>
                              <th>Notes</th>
                              {canDelete && <th>Actions</th>}
                           </tr>
                        </thead>

                        <tbody>
                           {records.map(r => (
                              <tr key={r._id}>
                                 <td>{r.category}</td>
                                 {role !== 'VIEWER' && <td>{r.createdBy?.name || '—'}</td>}
                                 <td>${r.amount}</td>
                                 <td>{r.notes || '—'}</td>

                                 {canDelete && (
                                    <td>
                                    <button className={styles.editBtn}
                                       onClick={() =>{
                                          setEditingRecord(r);
                                          setTimeout(() => {
                                             addRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                          }, 100); 
                                         } }
                                    >
                                          Edit
                                       </button>

                                       <button
                                          className={styles.deleteBtn}
                                          onClick={() => handleDelete(r._id)}
                                       >
                                          Delete
                                       </button>
                                    </td>
                                 )}
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  <button onClick={loadMore} className={styles.loadMore}>
                     View More
                  </button>
               </>
            )}

            {canCreate && (
               <>
                  <h3 ref={addRef} className={styles.sectionTitle}>
                     {editingRecord ? 'Update Record' : 'Add Record'}
                  </h3>

                  <RecordForm
                     record={editingRecord}
                     onSuccess={() =>
                     {
                        setEditingRecord(null);
                        fetchData(1);
                     }}
                  />
               </>
            )}
         </div>
      </>
   );
}