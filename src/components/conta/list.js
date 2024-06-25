// components/AccountsList.js
import React from 'react';
import AccountItem from './item';
import styles from '@/styles/Crud.module.css';

const AccountsList = ({ accounts, onEdit, onDelete }) => {
  return (
    <ul className={styles.list}>
      {accounts.map(account => (
        <AccountItem key={account._id} account={account} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default AccountsList;
