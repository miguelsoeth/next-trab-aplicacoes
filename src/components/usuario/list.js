// components/UsersList.js
import React from 'react';
import UserItem from './item';
import styles from '@/styles/Crud.module.css';

const UsersList = ({ users, onEdit, onDelete }) => {
  return (
    <ul className={styles.list}>
      {users.map(user => (
        <UserItem key={user._id} user={user} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default UsersList;
