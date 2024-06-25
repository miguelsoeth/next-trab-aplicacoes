// components/UserItem.js
import React, { useState } from 'react';
import styles from '@/styles/Crud.module.css';

const UserItem = ({ user, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    email: user.email,
    user: user.user,
    level: user.level,
    status: user.status,
  });

  const handleSave = () => {
    if (!editedUser.name || !editedUser.email || !editedUser.user || !editedUser.level) {
      alert('Preencha todos os campos para editar um usuário!');
      return;
    }
    onEdit(user._id, editedUser);
    setIsEditing(false);
  };

  return (
    <li className={styles.item}>
      {isEditing ? (
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
          <select
            value={editedUser.level}
            onChange={(e) => setEditedUser({ ...editedUser, level: e.target.value })}
            className={styles.input}
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          <select
            value={editedUser.status}
            onChange={(e) => setEditedUser({ ...editedUser, status: e.target.value })}
            className={styles.input}
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
          <button onClick={handleSave} className={styles.button}>Salvar</button>
          <button onClick={() => setIsEditing(false)} className={styles.button}>Cancelar</button>
        </>
      ) : (
        <>
          <div className={styles.item_content}>
            <div className={styles.item_container}><span>Nome</span>{user.name}</div>
            <div className={styles.item_container}><span>Email</span>{user.email}</div>
            <div className={styles.item_container}><span>Usuário</span>{user.user}</div>
            <div className={styles.item_container}><span>Nível</span>{user.level}</div>
            <div className={styles.item_container}><span>Status</span>{user.status ? 'Ativo' : 'Inativo'}</div>
          </div>
          <div className={styles.manage_buttons}>
            <button onClick={() => setIsEditing(true)} className={styles.button}>Editar</button>
            <button onClick={() => onDelete(user._id)} className={`${styles.button} ${styles.deleteButton}`}>Deletar</button>
          </div>
        </>
      )}
    </li>
  );
};

export default UserItem;
