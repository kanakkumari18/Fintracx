import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import
{
   getSummary,
   getRecords,
   deleteRecord,
   logoutUser,
   getUsers,
   updateUserRole,
   updateUserStatus,
   deleteUser
} from '../utils/api';

import SummaryCard from '../components/SummaryCard';
import RecordForm from '../components/RecordForm';
import styles from '../styles/admin.module.css';

export default function Admin()
{
   const router = useRouter();

   const [summary, setSummary] = useState(null);
   const [records, setRecords] = useState([]);
   const [users, setUsers] = useState([]);
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(true);
   const [editingRecord, setEditingRecord] = useState(null);
   const addRef = useRef(null);
   const [startDate, setStartDate] = useState('');
   const [endDate, setEndDate] = useState('');

   const [username, setUsername] = useState('');
   const [role, setRole] = useState('');
   const [mounted, setMounted] = useState(false);
   const [showDropdown, setShowDropdown] = useState(false);


   const [page, setPage] = useState(1);

   const summaryRef = useRef(null);
   const transactionsRef = useRef(null);
   const recordsRef = useRef(null);
   const usersRef = useRef(null);
   const [search, setSearch] = useState('');

   const [typeFilter, setTypeFilter] = useState('');
   const [categoryFilter, setCategoryFilter] = useState('');

   const scrollToSection = (ref) =>
   {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
   };

   const fetchData = async (currentPage = 1, append = false) =>
   {
      try
      {
         setError('');
         setLoading(true);

         const [summaryRes, recordsRes, usersRes] = await Promise.all(
         [
            getSummary(),
            getRecords({
               page: currentPage,
               limit: 10,
               search,
               type: typeFilter,
               category: categoryFilter,
               startDate,
               endDate
            }),
            getUsers()
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

         if (usersRes.users) setUsers(usersRes.users);
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

      if (userRole !== 'ADMIN')
      {
         router.push('/dashboard');
         return;
      }

      setUsername(name || 'Admin');
      setRole(userRole);

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
         alert(error.message);
      }
   };

   const handleRoleChange = async (id, role) =>
   {
      const currentUserId = localStorage.getItem('userId');

      if (id === currentUserId)
      {
         alert('Cannot change your own role');
         return;
      }

      try
      {
         await updateUserRole(id, role);
         fetchData(1);
      }
      catch (error)
      {
         alert(error.message);
      }
   };

   const handleStatusChange = async (id, currentStatus) =>
   {
      const currentUserId = localStorage.getItem('userId');

      if (id === currentUserId)
      {
         alert('Cannot change your own status');
         return;
      }

      try
      {
         await updateUserStatus(id, !currentStatus);
         fetchData(1);
      }
      catch (error)
      {
         alert(error.message);
      }
   };

   const handleUserDelete = async (id) =>
   {
      const currentUserId = localStorage.getItem('userId');

      if (id === currentUserId)
      {
         alert('Cannot delete yourself');
         return;
      }

      try
      {
         await deleteUser(id);
         fetchData(1);
      }
      catch (error)
      {
         alert(error.message);
      }
   };

   const loadMore = async () =>
   {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchData(nextPage, true);
   };

   return (
      <>
         <Head>
            <title>{username ? `${username} | ${role}` : 'Admin'}</title>
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
                     <button onClick={() => router.push('/dashboard')}>
                        Dashboard
                     </button>

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
               <button onClick={() => scrollToSection(transactionsRef)}>Transactions</button>
               <button onClick={() => scrollToSection(recordsRef)}>Records</button>
               <button onClick={() => scrollToSection(usersRef)}>Users</button>
               <button onClick={() => scrollToSection(addRef)}>Add</button>
            </div>

            {loading && <p className={styles.loading}>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {summary && !loading && (
               <>
                  <div ref={summaryRef} className={styles.cardGrid}>
                     <SummaryCard label="Total Income" value={`$${summary.overview.income.toFixed(2)}`} />
                     <SummaryCard label="Total Expense" value={`$${summary.overview.expense.toFixed(2)}`} />
                     <SummaryCard label="Net Balance" value={`$${summary.overview.netBalance.toFixed(2)}`} />
                  </div>

                  <h3 ref={transactionsRef} className={styles.sectionTitle}>Recent Transactions</h3>

                  <div className={styles.tableWrapper}>
                     <table className={styles.table}>
                        <thead>
                           <tr>
                              <th>Date</th>
                              <th>Type</th>
                              <th>Category</th>
                              <th>Amount</th>
                              <th>Notes</th>
                           </tr>
                        </thead>
                        <tbody>
                           {summary.recentTransactions.map((t) => (
                              <tr key={t._id}>
                                 <td>{new Date(t.date).toLocaleDateString()}</td>
                                 <td>{t.type}</td>
                                 <td>{t.category}</td>
                                 <td>${t.amount.toFixed(2)}</td>
                                 <td>{t.notes || '—'}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>



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
                              <th>Date</th>
                              <th>Type</th>
                              <th>Category</th>
                              <th>Amount</th>
                              <th>User</th>
                              <th>Notes</th>
                              <th>Actions</th>
                           </tr>
                        </thead>

                        <tbody>
                           {records.map((r) => (
                              <tr key={r._id}>
                                 <td>{new Date(r.date).toLocaleDateString()}</td>
                                 <td>{r.type}</td>
                                 <td>{r.category}</td>
                                 <td>${r.amount.toFixed(2)}</td>
                                 <td>{r.createdBy?.name || '—'}</td>
                                 <td>{r.notes || '—'}</td>
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
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  <button onClick={loadMore} className={styles.loadMore}>
                     View More
                  </button>
                  <h3 ref={usersRef} className={styles.sectionTitle}>User Management</h3>

                  <div className={styles.tableWrapper}>
                     <table className={styles.table}>
                        <thead>
                           <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Role</th>
                              <th>Status</th>
                              <th>Actions</th>
                           </tr>
                        </thead>

                        <tbody>
                           {users.map((u) => (
                              <tr key={u._id}>
                                 <td>{u.name}</td>
                                 <td>{u.email}</td>

                                 <td>
                                    <select
                                       className={styles.select}
                                       value={u.role}
                                       onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                    >
                                       <option value="VIEWER">VIEWER</option>
                                       <option value="ANALYST">ANALYST</option>
                                       <option value="ADMIN">ADMIN</option>
                                    </select>
                                 </td>

                                 <td>{u.isActive ? 'Active' : 'Inactive'}</td>

                                 <td>
                                    <button
                                       className={styles.statusBtn}
                                       onClick={() => handleStatusChange(u._id, u.isActive)}
                                    >
                                       {u.isActive ? 'Deactivate' : 'Activate'}
                                    </button>

                                    <button
                                       className={styles.deleteBtn}
                                       onClick={() => handleUserDelete(u._id)}
                                    >
                                       Delete
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </>
            )}
            <h3 ref={addRef} className={styles.sectionTitle}>
               {editingRecord ? 'Update Record' : 'Add Record'}
            </h3>

            <RecordForm
               users={users}
               record={editingRecord}
               onSuccess={() =>
               {
                  setEditingRecord(null);
                  fetchData(1);
               }}
            />
         </div>
      </>
   );
}