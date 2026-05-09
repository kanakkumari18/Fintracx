import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps })
{
   return (
      <>
         <Head>
            <title>Fintracx | Finance Dashboard</title>
            <meta name="description" content="Smart finance dashboard with analytics, tracking, and role-based access control" />

            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="icon" type="image/png" href="/favicon.png" />
            <link rel="shortcut icon" href="/favicon.ico" />
         </Head>

         <Component {...pageProps} />
      </>
   );
}