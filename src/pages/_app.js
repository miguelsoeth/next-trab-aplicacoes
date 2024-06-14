import Layout from "@/components/layout";
import { useRouter } from 'next/router';
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter(); // Get router object
  const isLoginPage = router.pathname === '/login';

  if (!isLoginPage) {
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }

  return <Component {...pageProps} />;
}
