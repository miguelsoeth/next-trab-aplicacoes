import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Topbar.module.css';
import { useRouter } from 'next/router';
import HomeIcon from '@mui/icons-material/Home';
import jwt from 'jsonwebtoken';

const topbar = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [token, setToken] = useState(null);    

    const logout = () => {
        localStorage.removeItem("token");
        router.push('/login');
    };

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        if (token) {
            const decodedToken = jwt.decode(token);
            if (decodedToken.user) {
                setUser(decodedToken.user);
            }    
        } else {
            setUser(null);
        }
    }, [token]);

    if (!user) {
        return null;
    }

    return (
        <div className={styles.adminContainer}>
            <h1 className={styles.header}>
                {user.name}
                  
            </h1>
            <div className={styles.linksContainer}>
                <Link href="/cadastrar/usuario" className={styles.link}>
                    Cadastrar Usuários
                </Link>
                <Link href="/cadastrar/categoria" className={styles.link}>
                    Cadastrar Categorias
                </Link>
                <Link href="/cadastrar/conta" className={styles.link}>
                    Cadastrar Contas
                </Link>           
                <Link href="/cadastrar/entrada" className={styles.link}>
                    Cadastrar Receitas/Despesas
                </Link>
                <Link href="/lancamentos" className={styles.link}>
                    Lançamentos
                </Link>
            </div>
            <div className={styles.logout_container}>            
                <Link href="/" className={styles.logout}>
                    <HomeIcon fontSize="inherit" />
                </Link>         
                <button onClick={logout} className={styles.logout}>Logout</button>                
            </div>
        </div>
    );
};

export default topbar;
