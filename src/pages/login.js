import { useEffect, useState } from 'react';
import styles from '../styles/Login.module.css'; 
import axios from 'axios';
import { useRouter } from 'next/router';
import SnackbarComponent from '@/components/snackbar';

const Login = () => {
    const [user, setAccount] = useState('');
    const [pwd, setPassword] = useState('');
    const router = useRouter();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { user, pwd });
            const data = response.data;
            if (data.token) {
                //alert(data.message);
                localStorage.setItem('token', data.token);
                router.push('/');
            }
        } catch (error) {
            const errorMessage = error.response.data.message || 'Erro';
            setSnackbarMessage(errorMessage);
            setSnackbarOpen(true);
            //alert(error.response.data.message);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/');
        }
    }, []);

    return (
        <div className={styles.loginContainer}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="account">Usuário:</label>
                    <input
                        id="account"
                        name="account"
                        value={user}
                        onChange={(e) => setAccount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={pwd}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>            
            <SnackbarComponent
                open={snackbarOpen}
                message={snackbarMessage}
                onClose={handleCloseSnackbar}
            />        
        </div>
    );
};

export default Login;
