import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import styles from '../styles/profile.module.css';

import {
   getMyProfile,
   updateMyProfile,
   changePassword,
   logoutUser
} from '../utils/api';

export default function Profile()
{
   const router = useRouter();

   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [message, setMessage] = useState('');

   const [name, setName] = useState('');
   const [email, setEmail] = useState('');

   const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');

   useEffect(() =>
   {
      const token = localStorage.getItem('token');
      if (!token)
      {
         router.push('/login');
         return;
      }

      fetchProfile();
   }, []);

   const fetchProfile = async () =>
   {
      try
      {
         const res = await getMyProfile();
         setUser(res.user);
         setName(res.user.name);
         setEmail(res.user.email);
      }
      catch (err)
      {
         setMessage(err.message);
      }
      finally
      {
         setLoading(false);
      }
   };

   const handleUpdate = async () =>
   {
      try
      {
         const res = await updateMyProfile({ name, email });
         setMessage(res.message);
      }
      catch (err)
      {
         setMessage(err.message);
      }
   };

   const handlePassword = async () =>
   {
      try
      {
         const res = await changePassword({ currentPassword, newPassword });
         setMessage(res.message);
         setCurrentPassword('');
         setNewPassword('');
      }
      catch (err)
      {
         setMessage(err.message);
      }
   };

   if (loading) return <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>;

   return (
      <>
         <title>
            {user ? `${user.name} | Profile` : 'Profile'}
         </title>

         <div style={{
            minHeight: '100vh',
            background: '#020617',
            color: '#fff'
         }}>

            <div style={{
               width: '100%',
               padding: '20px 32px',
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               background: '#020617'
            }}>
               <div>
                  <h1 style={{
                     margin: 0,
                     fontSize: '26px',
                     fontWeight: '700',
                     color: '#e5e7eb'
                  }}>
                     {user?.name}&apos;s Profile
                  </h1>

                  <p style={{
                     margin: 0,
                     fontSize: '12px',
                     letterSpacing: '2px',
                     color: '#6b7280'
                  }}>
                     {user?.role}
                  </p>
               </div>

               <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => router.push('/dashboard')} style={topBtn}>
                     Go Back to Dashboard
                  </button>

                  <button onClick={() => {
                     logoutUser();
                     router.push('/login');
                  }} style={topBtn}>
                     Logout
                  </button>
               </div>
            </div>

            <div className={styles.container}>

               <h2 style={{
                  textAlign: 'center',
                  fontSize: '22px',
                  marginTop: '1px',
                  marginBottom: '8px'
               }}>
                  Profile Settings
               </h2>

               {message && <p className={styles.message}>{message}</p>}

               <div className={styles.card}>
                  <h3>Update Profile</h3>

                  <input
                     type="text"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     placeholder="Name"
                  />

                  <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="Email"
                  />

                  <button onClick={handleUpdate}>Save Changes</button>
               </div>

               <div className={styles.card}>
                  <h3>Change Password</h3>

                  <input
                     type="password"
                     value={currentPassword}
                     onChange={(e) => setCurrentPassword(e.target.value)}
                     placeholder="Current Password"
                  />

                  <input
                     type="password"
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     placeholder="New Password"
                  />

                  <button onClick={handlePassword}>Update Password</button>
               </div>

            </div>
         </div>
      </>
   );
}

const topBtn = {
   padding: '10px 16px',
   borderRadius: '12px',
   border: 'none',
   background: '#1f2937',
   color: '#e5e7eb',
   cursor: 'pointer',
   fontWeight: '500'
};