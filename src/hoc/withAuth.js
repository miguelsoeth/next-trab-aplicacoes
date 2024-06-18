// withAuth.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { checkAuth } from '../utils/authenticate';
import { ClipLoader } from 'react-spinners';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(true);
    const router = useRouter();

    const verifyToken = async () => {
      //FAKE LOAD TIME
      await new Promise((resolve) => setTimeout(resolve, 250));

      const auth = await checkAuth();
      if (!auth.isValid) {
        localStorage.removeItem('token');
        router.push('/login');
      }

      if (!auth.isAdmin) {
        setIsAdmin(false);
      }

      setLoading(false);
    };

    useEffect(() => {
      console.log('Verificando Token');
      verifyToken();
    }, []);

    if (loading) {
      return (
        <div style={styles.spinnerContainer}>
          <ClipLoader size={80} />
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <div style={styles.spinnerContainer}>
          <strong>Necessário ser administrador para acessar esse conteúdo!</strong>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

const styles = {
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '200px 0px',
    alignItems: 'center'
  },
};

export default withAuth;
