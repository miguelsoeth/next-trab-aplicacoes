// pages/accounts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setAuthHeader } from '@/utils/authenticate';
import styles from '@/styles/Crud.module.css';
import withAuth from '@/hoc/withAuth';
import AccountForm from '@/components/conta/form';
import AccountsList from '@/components/conta/list';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    setAuthHeader(localStorage.getItem('token'));
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleCreateAccount = async (newAccount) => {
    try {
      await axios.post('http://localhost:8080/api/accounts', newAccount);
      fetchAccounts();
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm("Deseja mesmo deletar essa conta?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/accounts/${accountId}`);
      setAccounts(accounts.filter(account => account._id !== accountId));
    } catch (error) {
      console.error(`Error deleting account ${accountId}:`, error);
    }
  };

  const handleEditAccount = async (accountId, updatedAccount) => {
    if (!window.confirm("Deseja mesmo editar essa conta?")) {
      return;
    }
    try {
      await axios.put(`http://localhost:8080/api/accounts/${accountId}`, updatedAccount);
      fetchAccounts();
    } catch (error) {
      console.error(`Error updating account ${accountId}:`, error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contas</h1>
      <AccountForm onCreate={handleCreateAccount} />
      <AccountsList accounts={accounts} onEdit={handleEditAccount} onDelete={handleDeleteAccount} />
    </div>
  );
};

export default withAuth(AccountsPage);
