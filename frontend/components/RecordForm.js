import { useState, useEffect } from 'react';
import { createRecord, updateRecord } from '../utils/api';
import styles from './RecordForm.module.css';

export default function RecordForm({ onSuccess, users = [], record })
{
   const today = new Date().toISOString().split('T')[0];

   const defaultCategories = [
      'Salary','Food','Entertainment','Health','Education',
      'Electronics','Travel','Shopping','Bills','Investment','Other'
   ];

   const [form, setForm] = useState({
      amount: '',
      type: 'income',
      category: '',
      date: today,
      notes: '',
      createdBy: ''
   });

   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [role, setRole] = useState(null);

   const isEdit = !!record;

   useEffect(() =>
   {
      const userRole = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');

      setRole(userRole);

      if (userRole === 'ADMIN')
      {
         setForm(prev => ({
            ...prev,
            createdBy: userId || ''
         }));
      }
   }, []);

   useEffect(() =>
   {
      if (role === 'ADMIN' && users.length > 0 && !form.createdBy)
      {
         setForm(prev => ({ ...prev, createdBy: users[0]._id }));
      }
   }, [users]);

   useEffect(() =>
   {
      if (record)
      {
         setForm({
            amount: record.amount || '',
            type: record.type || 'income',
            category: record.category || '',
            date: record.date ? record.date.split('T')[0] : today,
            notes: record.notes || '',
            createdBy: record.createdBy?._id || ''
         });
      }
      else
      {
         setForm(prev => ({
            amount: '',
            type: 'income',
            category: '',
            date: today,
            notes: '',
            createdBy: prev.createdBy
         }));
      }
   }, [record]);

   if (role === 'VIEWER') return null;

   const handleChange = (e) =>
   {
      setForm({
         ...form,
         [e.target.name]: e.target.value
      });
   };

   const handleSubmit = async (e) =>
   {
      e.preventDefault();

      const amount = Number(form.amount);

      if (!amount || amount <= 0)
      {
         setError('Amount must be greater than 0');
         return;
      }

      if (!form.category.trim())
      {
         setError('Category is required');
         return;
      }

      setError('');
      setLoading(true);

      try
      {
         if (isEdit)
         {
            await updateRecord(record._id, {
               ...form,
               amount,
               category: form.category.trim()
            });
         }
         else
         {
            await createRecord({
               ...form,
               amount,
               category: form.category.trim()
            });
         }

         if (onSuccess) onSuccess();
      }
      catch (error)
      {
         setError(error.message || 'Failed to submit record');
      }
      finally
      {
         setLoading(false);
      }
   };

   return (
      <div className={styles.wrapper}>
         <form onSubmit={handleSubmit}>

            <div className={styles.row}>
               <input
                  className={styles.input}
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  min="1"
               />

               <select
                  className={styles.input}
                  name="type"
                  value={form.type}
                  onChange={handleChange}
               >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
               </select>
            </div>

            <div className={styles.row}>
               <select
                  className={styles.input}
                  name="category"
                  value={form.category}
                  onChange={handleChange}
               >
                  <option value="">Select Category</option>
                  {defaultCategories.map((c, i) => (
                     <option key={i} value={c}>{c}</option>
                  ))}
               </select>

               <input
                  className={`${styles.input} ${styles.dateInput}`}
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
               />
            </div>

            <input
               className={`${styles.input} ${styles.full}`}
               type="text"
               name="notes"
               value={form.notes}
               onChange={handleChange}
            />

            {role === 'ADMIN' && users.length > 0 && (
               <select
                  className={`${styles.input} ${styles.full}`}
                  name="createdBy"
                  value={form.createdBy}
                  onChange={handleChange}
               >
                  <option value="">Select User</option>
                  {users.map((u) => (
                     <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                     </option>
                  ))}
               </select>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <button
               type="submit"
               disabled={loading}
               className={styles.button}
            >
               {loading
                  ? (isEdit ? 'Updating...' : 'Adding...')
                  : (isEdit ? 'Update Record' : 'Add Record')}
            </button>

         </form>
      </div>
   );
}