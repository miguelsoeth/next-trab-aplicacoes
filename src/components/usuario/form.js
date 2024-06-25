// components/UserForm.js
import React, { useState } from 'react';
import styles from '@/styles/Crud.module.css';

const UserForm = ({ onCreate }) => {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    user: '',
    pwd: '',
    level: '',
    status: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.user || !newUser.pwd || !newUser.level) {
      alert('Preencha todos os campos para criar um usuário!');
      return;
    }
    onCreate(newUser);
    setNewUser({
      name: '',
      email: '',
      user: '',
      pwd: '',
      level: '',
      status: true
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        className={styles.input}
      />
      <input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        className={styles.input}
      />
      <input
        type="text"
        placeholder="Usuário"
        value={newUser.user}
        onChange={(e) => setNewUser({ ...newUser, user: e.target.value })}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Senha"
        value={newUser.pwd}
        onChange={(e) => setNewUser({ ...newUser, pwd: e.target.value })}
        className={styles.input}
      />
      <select
        value={newUser.level}
        onChange={(e) => setNewUser({ ...newUser, level: e.target.value })}
        className={styles.input}
      >
        <option value="">Selecione o nível</option>
        <option value="Admin">Admin</option>
        <option value="User">User</option>
      </select>
      <button type="submit" className={styles.button}>Criar usuário</button>
    </form>
  );
};

export default UserForm;
