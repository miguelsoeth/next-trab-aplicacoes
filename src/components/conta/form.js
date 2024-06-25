// components/AccountForm.js
import React, { useState } from 'react';
import styles from '@/styles/Crud.module.css';

const AccountForm = ({ onCreate }) => {
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !comment) {
      alert('Preencha todos os campos!');
      return;
    }
    onCreate({ description, comment });
    setDescription('');
    setComment('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Desc. da conta"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={styles.input}
      />
      <input
        type="text"
        placeholder="Comentário"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>Criar conta</button>
    </form>
  );
};

export default AccountForm;
