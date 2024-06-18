import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setAuthHeader } from '@/utils/authenticate';
import styles from '@/styles/Crud.module.css';
import withAuth from '@/hoc/withAuth';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [newAccountDescription, setNewAccountDescription] = useState('');
  const [newAccountComment, setNewAccountComment] = useState('');
  const [editMode, setEditMode] = useState(null); // To track which account is being edited
  const [editedDescription, setEditedDescription] = useState('');
  const [editedComment, setEditedComment] = useState('');

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

  const handleSetEditMode = async (account) => {
    setEditedDescription(account.description);
    setEditedComment(account.comments);
    setEditMode(account._id);
  }

  const handleCreateAccount = async () => {
    if (!newAccountDescription) {
        alert('Preenchar o campo de descrição para criar uma conta!');
        return;
    }

    if (!newAccountComment) {
        alert('Preenchar o campo de comentário para criar uma conta!');
        return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/accounts', {
        description: newAccountDescription,
        comments: newAccountComment
      });
      fetchAccounts();
      setNewAccountDescription('');
      setNewAccountComment('');
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    let confirmed = window.confirm("Deseja mesmo deletar essa conta?");

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/accounts/${accountId}`);
      setAccounts(accounts.filter(account => account._id !== accountId));
    } catch (error) {
      console.error(`Error deleting account ${accountId}:`, error);
    }
  };

  const handleEditAccount = async (account) => {
    let confirmed = window.confirm("Deseja mesmo editar essa conta?");

    if (!confirmed) {
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/accounts/${account._id}`, {
        description: editedDescription,
        comments: editedComment
      });
      fetchAccounts();
      cancelEdit();
    } catch (error) {
      console.error(`Error updating account ${account._id}:`, error);
    }
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditedDescription('');
    setEditedComment('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contas</h1>
  
      {/* Form to create a new account */}
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleCreateAccount(); }}>
        <input
          type="text"
          placeholder="Desc. da conta"
          value={newAccountDescription}
          onChange={(e) => setNewAccountDescription(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Comentário"
          value={newAccountComment}
          onChange={(e) => setNewAccountComment(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Criar conta</button>
      </form>
  
      {/* List of accounts */}
      <ul className={styles.list}>
        {accounts.map(account => (
          <li key={account._id} className={styles.item}>
            {editMode === account._id ? (
              <>
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className={styles.input}
                />
                <input
                  type="text"
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className={styles.input}
                />
                <button onClick={() => handleEditAccount(account)} className={styles.button}>Salvar</button>
                <button onClick={() => cancelEdit()} className={styles.button}>Cancelar</button>
              </>
            ) : (
              <>
                <div className={styles.item_content}>
                  <div>{account.description}</div>
                  <div>{account.comments}</div>
                </div>
                <div className={styles.manage_buttons}>
                  <button onClick={() => handleSetEditMode(account)} className={styles.button}>Editar</button>
                  <button onClick={() => handleDeleteAccount(account._id)} className={`${styles.button} ${styles.deleteButton}`}>Deletar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withAuth(AccountsPage);
