// components/CategoryForm.js
import React, { useState } from 'react';
import styles from '@/styles/Crud.module.css';

const CategoryForm = ({ onCreate }) => {
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !type) {
      alert('Preencha todos os campos!');
      return;
    }
    onCreate({ description, type });
    setDescription('');
    setType('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Desc. da categoria"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={styles.input}
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className={styles.input}
      >
        <option value="">Selecione o tipo</option>
        <option value="Receita">Receita</option>
        <option value="Despesa">Despesa</option>
      </select>
      <button type="submit" className={styles.button}>Criar categoria</button>
    </form>
  );
};

export default CategoryForm;
