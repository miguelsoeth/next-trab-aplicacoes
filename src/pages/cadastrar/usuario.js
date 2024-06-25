// pages/users.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setAuthHeader } from '@/utils/authenticate';
import styles from '@/styles/Crud.module.css';
import withAuth from '@/hoc/withAuth';
import UserForm from '@/components/usuario/form';
import UsersList from '@/components/usuario/list';

const UsersPage = () => {
  const [users, setUsers] = useState([]);

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

  const handleCreateUser = async (newUser) => {
    try {
      await axios.post('http://localhost:8080/api/users/register', newUser);
      fetchUsers();
      alert("Usuário criado com sucesso!")
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Deseja mesmo deletar esse usuário?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
    }
  };

  const handleEditUser = async (userId, updatedUser) => {
    if (!window.confirm("Deseja mesmo editar esse usuário?")) {
      return;
    }
    try {
      await axios.put(`http://localhost:8080/api/users/${userId}`, updatedUser);
      fetchUsers();
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Usuários</h1>
      <UserForm onCreate={handleCreateUser} />
      <UsersList users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
    </div>
  );
};

export default withAuth(UsersPage);
