import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setAuthHeader } from '@/utils/authenticate';
import styles from '@/styles/Conta.module.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserUser, setNewUserUser] = useState('');
  const [newUserPwd, setNewUserPwd] = useState('');
  const [newUserLevel, setNewUserLevel] = useState('');
  const [newUserStatus, setNewUserStatus] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    user: '',
    pwd: '',
    level: '',
    status: true
  });

  useEffect(() => {
    setAuthHeader(localStorage.getItem('token'));
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {        
      const response = await axios.get('http://localhost:8080/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSetEditMode = async (user) => {
    const { pwd, ...userWithoutPwd } = user;
    setEditedUser(userWithoutPwd);
    setEditMode(user._id);
  };

  const handleCreateUser = async () => {
    if (!newUserName || !newUserEmail || !newUserUser || !newUserPwd || !newUserLevel) {
      alert('Preencha todos os campos para criar um usuário!');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/users/register', {
        name: newUserName,
        email: newUserEmail,
        user: newUserUser,
        pwd: newUserPwd,
        level: newUserLevel,
        status: newUserStatus
      });
      fetchUsers();
      setNewUserName('');
      setNewUserEmail('');
      setNewUserUser('');
      setNewUserPwd('');
      setNewUserLevel('');
      setNewUserStatus(true);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    let confirmed = window.confirm("Deseja mesmo deletar esse usuário?");

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
    }
  };

  const handleEditUser = async () => {
    let confirmed = window.confirm("Deseja mesmo editar esse usuário?");

    if (!confirmed) {
      return;
    }

    if (!editedUser.name || !editedUser.email || !editedUser.user || !editedUser.pwd || !editedUser.status) {
      alert('Preencha todos os campos para editar um usuário!');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8080/api/users/${editedUser._id}`, {
        name: editedUser.name,
        email: editedUser.email,
        user: editedUser.user,
        pwd: editedUser.pwd,
        level: editedUser.level,
        status: editedUser.status
      });
      fetchUsers();
      cancelEdit();
    } catch (error) {
      console.error(`Error updating user ${editedUser._id}:`, error);
    }
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditedUser({
      name: '',
      email: '',
      user: '',
      pwd: '',
      level: '',
      status: true
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Usuários</h1>
  
      {/* Formulário para criar um novo usuário */}
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }}>
        <input
          type="text"
          placeholder="Nome"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Usuário"
          value={newUserUser}
          onChange={(e) => setNewUserUser(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={newUserPwd}
          onChange={(e) => setNewUserPwd(e.target.value)}
          className={styles.input}
        />
        <select
          value={newUserLevel}
          onChange={(e) => setNewUserLevel(e.target.value)}
          className={styles.input}
        >
          <option value="">Selecione o nível</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
        <button type="submit" className={styles.button}>Criar usuário</button>
      </form>
  
      {/* Lista de usuários */}
      <ul className={styles.list}>
        {users.map(user => (
          <li key={user._id} className={styles.item}>
            {editMode === user._id ? (
              <>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className={styles.input}
                />
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  className={styles.input}
                />
                <input
                  type="text"
                  value={editedUser.user}
                  onChange={(e) => setEditedUser({ ...editedUser, user: e.target.value })}
                  className={styles.input}
                />
                <input
                  type="password"
                  onChange={(e) => setEditedUser({ ...editedUser, pwd: e.target.value })}
                  className={styles.input}
                />
                <select
                  value={editedUser.level}
                  onChange={(e) => setEditedUser({ ...editedUser, level: e.target.value })}
                  className={styles.input}
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
                <button onClick={() => handleEditUser()} className={styles.button}>Salvar</button>
                <button onClick={() => cancelEdit()} className={styles.button}>Cancelar</button>
              </>
            ) : (
              <>
                <div className={styles.item_content}>
                  <div>{user.name}</div>
                  <div>{user.email}</div>
                  <div>{user.user}</div>
                  <div>{user.level}</div>
                  <div>{user.status ? 'Ativo' : 'Inativo'}</div>
                </div>
                <div>
                  <button onClick={() => handleSetEditMode(user)} className={styles.button}>Editar</button>
                  <button onClick={() => handleDeleteUser(user._id)} className={`${styles.button} ${styles.deleteButton}`}>Deletar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
