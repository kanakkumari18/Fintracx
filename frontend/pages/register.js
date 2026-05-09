import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { registerUser } from '../utils/api';

export default function Register()
{
   const router = useRouter();

   const [form, setForm] = useState({
      name: '',
      email: '',
      password: ''
   });

   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [toast, setToast] = useState({ message: '', type: '' });

   const handleChange = (e) =>
   {
      setForm({
         ...form,
         [e.target.name]: e.target.value
      });
   };

   const showToast = (message, type = 'info') =>
   {
      setToast({ message, type });

      setTimeout(() =>
      {
         setToast({ message: '', type: '' });
      }, 2500);
   };

   const handleSubmit = async (e) =>
   {
      e.preventDefault();

      if (!form.name || !form.email || !form.password)
      {
         setError('All fields are required');
         showToast('Missing fields', 'error');
         return;
      }

      setError('');
      setLoading(true);

      try
      {
         await registerUser(form.name, form.email, form.password);
         showToast('Account created', 'success');
         router.push('/login');
      }
      catch (err)
      {
         const msg = err.message || 'Registration failed';
         setError(msg);
         showToast(msg, 'error');
      }
      finally
      {
         setLoading(false);
      }
   };

   return (
      <>
         <Head>
            <title>Fintracx | Register</title>
         </Head>

         <div style={{
            minHeight: '100vh',
            background: '#0b0f19',
            fontFamily: 'Inter, sans-serif'
         }}>

            <div style={{
               width: '100%',
               display: 'flex',
               justifyContent: 'center',
               paddingTop: 24
            }}>
               <div style={{
                  width: '90%',
                  maxWidth: 1100,
                  padding: '14px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#0b0f19',
                  borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
               }}>
                  <h2
                     style={{
                        margin: 0,
                        color: '#fff',
                        fontWeight: 700,
                        cursor: 'pointer'
                     }}
                     onClick={() => router.push('/')}
                  >
                     Fintracx
                  </h2>

                  <div style={{ display: 'flex', gap: 12 }}>
                     <button onClick={() => router.push('/')} style={navBtn}>
                        Home
                     </button>
                  </div>
               </div>
            </div>

            <div style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               minHeight: 'calc(100vh - 120px)',
               padding: '20px'
            }}>

               {toast.message && (
                  <div style={{
                     position: 'fixed',
                     top: '20px',
                     right: '20px',
                     padding: '12px 18px',
                     borderRadius: '10px',
                     color: '#fff',
                     fontSize: '13px',
                     background:
                        toast.type === 'success'
                           ? '#16a34a'
                           : toast.type === 'error'
                           ? '#dc2626'
                           : '#1f2937'
                  }}>
                     {toast.message}
                  </div>
               )}

               <div style={{
                  width: '100%',
                  maxWidth: '420px',
                  background: '#111827',
                  padding: '36px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.06)'
               }}>

                  <h2 style={{
                     fontSize: '22px',
                     fontWeight: '700',
                     textAlign: 'center',
                     marginBottom: '26px',
                     color: '#ffffff'
                  }}>
                     Create Account
                  </h2>

                  <form onSubmit={handleSubmit}>

                     <input
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        style={input}
                     />

                     <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        style={input}
                     />

                     <div style={{ position: 'relative' }}>
                        <input
                           name="password"
                           type={showPassword ? 'text' : 'password'}
                           placeholder="Password"
                           value={form.password}
                           onChange={handleChange}
                           style={input}
                        />

                        <span
                           onClick={() => setShowPassword(!showPassword)}
                           style={{
                              position: 'absolute',
                              right: '14px',
                              top: '12px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              color: '#9ca3af'
                           }}
                        >
                           {showPassword ? 'Hide' : 'Show'}
                        </span>
                     </div>

                     {error && (
                        <p style={{
                           color: '#dc2626',
                           fontSize: '13px',
                           marginBottom: '12px',
                           textAlign: 'center'
                        }}>
                           {error}
                        </p>
                     )}

                     <button
                        type="submit"
                        disabled={loading}
                        style={submitBtn}
                     >
                        {loading ? 'Creating...' : 'Register'}
                     </button>

                  </form>

                  <p style={{
                     marginTop: '20px',
                     textAlign: 'center',
                     fontSize: '13px',
                     color: '#9ca3af'
                  }}>
                     Already have an account?{' '}
                     <span
                        onClick={() => router.push('/login')}
                        style={{
                           color: '#ffffff',
                           cursor: 'pointer',
                           fontWeight: '600'
                        }}
                     >
                        Login
                     </span>
                  </p>

               </div>
            </div>
         </div>
      </>
   );
}

const navBtn = {
   padding: '8px 16px',
   borderRadius: 10,
   border: '1px solid rgba(255,255,255,0.2)',
   background: 'transparent',
   color: '#fff',
   cursor: 'pointer'
};

const submitBtn = {
   width: '100%',
   height: '46px',
   background: '#1f2937',
   color: '#fff',
   border: 'none',
   borderRadius: '10px',
   fontSize: '14px',
   fontWeight: '600',
   cursor: 'pointer'
};

const input = {
   width: '100%',
   height: '46px',
   padding: '0 12px',
   marginBottom: '16px',
   border: '1px solid rgba(255,255,255,0.08)',
   borderRadius: '10px',
   background: '#0b1220',
   color: '#ffffff',
   fontSize: '14px',
   outline: 'none'
};