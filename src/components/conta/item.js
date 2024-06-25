// components/AccountItem.js
import React, { useState } from 'react';
import styles from '@/styles/Crud.module.css';

const AccountItem = ({ account, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(account.description);
  const [editedComment, setEditedComment] = useState(account.comments);

  const handleSave = () => {
    onEdit(account._id, { description: editedDescription, comments: editedComment });
    setIsEditing(false);
  };

  return (
    <li className={styles.item}>
      {isEditing ? (
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
          <button onClick={handleSave} className={styles.button}>Salvar</button>
          <button onClick={() => setIsEditing(false)} className={styles.button}>Cancelar</button>
        </>
      ) : (
        <>
          <div className={styles.item_content}>
            <div>{account.description}</div>
            <div>{account.comments}</div>
          </div>
          <div className={styles.manage_buttons}>
            <button onClick={() => setIsEditing(true)} className={styles.button}>Editar</button>
            <button onClick={() => onDelete(account._id)} className={`${styles.button} ${styles.deleteButton}`}>Deletar</button>
          </div>
        </>
      )}
    </li>
  );
};

export default AccountItem;
