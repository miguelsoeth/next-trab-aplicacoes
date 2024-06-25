// components/CategoryItem.js
import React, { useState } from 'react';
import styles from '@/styles/Crud.module.css';

const CategoryItem = ({ category, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(category.description);
  const [editedType, setEditedType] = useState(category.type);

  const handleSave = () => {
    onEdit(category._id, { description: editedDescription, type: editedType });
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
          <select
            value={editedType}
            onChange={(e) => setEditedType(e.target.value)}
            className={styles.input}
          >
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
          </select>
          <button onClick={handleSave} className={styles.button}>Salvar</button>
          <button onClick={() => setIsEditing(false)} className={styles.button}>Cancelar</button>
        </>
      ) : (
        <>
          <div className={styles.item_content}>
            <div>{category.description}</div>
            <div>{category.type}</div>
          </div>
          <div className={styles.manage_buttons}>
            <button onClick={() => setIsEditing(true)} className={styles.button}>Editar</button>
            <button onClick={() => onDelete(category._id)} className={`${styles.button} ${styles.deleteButton}`}>Deletar</button>
          </div>
        </>
      )}
    </li>
  );
};

export default CategoryItem;
