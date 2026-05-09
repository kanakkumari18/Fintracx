import { useRouter } from 'next/router';

export default function Home()
{
   const router = useRouter();

   return (
      <div style={{
         fontFamily: 'Inter, sans-serif',
         background: '#0b0f19',
         color: '#e5e7eb',
         width: '100%',
         minHeight: '100vh'
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
               <h2 style={{
                  margin: 0,
                  color: '#fff',
                  fontWeight: 700
               }}>
                  Fintracx
               </h2>

               <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => router.push('/login')} style={navBtn}>
                     Login
                  </button>
                  <button onClick={() => router.push('/register')} style={primaryBtn}>
                     Get Started
                  </button>
               </div>
            </div>
         </div>

         <section style={{
            padding: '110px 20px 90px',
            textAlign: 'center',
            position: 'relative'
         }}>
            <div style={{
               position: 'absolute',
               width: 500,
               height: 500,
               background: '#1f2937',
               filter: 'blur(120px)',
               top: -120,
               left: '50%',
               transform: 'translateX(-50%)',
               opacity: 0.35,
               pointerEvents: 'none'
            }} />

            <h1 style={{
               fontSize: 52,
               fontWeight: 800,
               marginBottom: 20,
               color: '#ffffff'
            }}>
               Smarter Finance Starts Here
            </h1>

            <p style={{
               maxWidth: 620,
               margin: '0 auto 32px',
               color: '#9ca3af',
               fontSize: 16,
               lineHeight: 1.6
            }}>
               Take full control of your income, expenses, and financial insights in one intelligent platform.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
               <button onClick={() => router.push('/register')} style={primaryBig}>
                  Start Free
               </button>

               <button onClick={() => router.push('/login')} style={secondaryBig}>
                  Login
               </button>
            </div>
         </section>

         <section style={{ padding: '80px 40px' }}>
            <h2 style={{
               textAlign: 'center',
               fontSize: 28,
               marginBottom: 40
            }}>
               Core Features
            </h2>

            <div style={{
               display: 'grid',
               gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
               gap: 22
            }}>
               {features.map((f, i) => (
                  <div key={i} style={card}>
                     <h3 style={{ marginBottom: 10 }}>{f.title}</h3>
                     <p style={{ color: '#9ca3af' }}>{f.desc}</p>
                  </div>
               ))}
            </div>
         </section>

         <section style={{
            padding: '80px 20px',
            textAlign: 'center'
         }}>
            <h2 style={{ marginBottom: 20 }}>
               Take control of your finances today
            </h2>

            <button onClick={() => router.push('/register')} style={ctaBtn}>
               Create Free Account
            </button>
         </section>

         <footer style={{
            padding: 20,
            textAlign: 'center',
            color: '#6b7280',
            fontSize: 14
         }}>
            © 2026 Fintracx
         </footer>
      </div>
   );
}

const navBtn =
{
   padding: '8px 16px',
   borderRadius: 10,
   border: '1px solid rgba(255,255,255,0.2)',
   background: 'transparent',
   color: '#fff',
   cursor: 'pointer'
};

const primaryBtn =
{
   padding: '8px 16px',
   borderRadius: 10,
   border: 'none',
   background: '#1f2937',
   color: '#fff',
   cursor: 'pointer'
};

const primaryBig =
{
   padding: '14px 24px',
   borderRadius: 12,
   border: 'none',
   background: '#1f2937',
   color: '#fff',
   cursor: 'pointer'
};

const secondaryBig =
{
   padding: '14px 24px',
   borderRadius: 12,
   border: '1px solid rgba(255,255,255,0.2)',
   background: 'transparent',
   color: '#fff',
   cursor: 'pointer'
};

const ctaBtn =
{
   padding: '14px 26px',
   borderRadius: 12,
   border: 'none',
   background: '#111827',
   color: '#fff',
   cursor: 'pointer'
};

const card =
{
   padding: 26,
   borderRadius: 14,
   background: '#111827',
   border: '1px solid rgba(255,255,255,0.05)'
};

const features =
[
   { title: 'Income Tracking', desc: 'Track and manage all your earnings effortlessly.' },
   { title: 'Expense Management', desc: 'Stay in control of your spending with clarity.' },
   { title: 'Smart Insights', desc: 'Get meaningful analytics to make better decisions.' },
   { title: 'Role-Based Access', desc: 'Manage users with Admin, Analyst, and Viewer roles.' }
];