import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setAuthHeader } from '@/utils/authenticate';
import styles from '@/styles/Conta.module.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('');
  const [editMode, setEditMode] = useState(null); // To track which account is being edited
  const [editedDescription, setEditedDescription] = useState('');
  const [editedType, setEditedType] = useState('');

  useEffect(() => {
    setAuthHeader(localStorage.getItem('token'));
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {        
      const response = await axios.get('http://localhost:8080/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSetEditMode = async (categories) => {
    setEditedDescription(categories.description);
    setEditedType(categories.type);
    setEditMode(categories._id);
  }

  const handleCreateAccount = async () => {
    if (!newCategoryDescription) {
        alert('Preenchar o campo de descrição para criar uma categoria!');
        return;
    }

    if (!newCategoryType) {
        alert('Preenchar o campo de tipo para criar uma categoria!');
        return;
    }

    try {
      await axios.post('http://localhost:8080/api/categories', {
        description: newCategoryDescription,
        type: newCategoryType
      });
      fetchCategories();
      setNewCategoryDescription('');
      setNewCategoryType('');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteAccount = async (categoryId) => {
    let confirmed = window.confirm("Deseja mesmo deletar essa categoria?");

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/categories/${categoryId}`);
      setCategories(categories.filter(category => category._id !== categoryId));
    } catch (error) {
      console.error(`Error deleting category ${categoryId}:`, error);
    }
  };

  const handleEditAccount = async (category) => {
    let confirmed = window.confirm("Deseja mesmo editar essa categoria?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8080/api/categories/${category._id}`, {
        description: editedDescription,
        type: editedType
      });
      fetchCategories();
      cancelEdit();
    } catch (error) {
      console.error(`Error updating category ${category._id}:`, error);
    }
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditedDescription('');
    setEditedType('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Categorias</h1>
  
      {/* Form to create a new account */}
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleCreateAccount(); }}>
        <input
          type="text"
          placeholder="Desc. da categoria"
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
          className={styles.input}
        />
        <select
          value={newCategoryType}          
          onChange={(e) => setNewCategoryType(e.target.value)}
          className={styles.input}
        >
          <option value="">Selecione o tipo</option>
          <option value="Receita">Receita</option>
          <option value="Despesa">Despesa</option>
        </select>
        <button type="submit" className={styles.button}>Criar categoria</button>
      </form>
  
      {/* List of accounts */}
      <ul className={styles.list}>
        {categories.map(account => (
          <li key={account._id} className={styles.item}>
            {editMode === account._id ? (
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
                <button onClick={() => handleEditAccount(account)} className={styles.button}>Salvar</button>
                <button onClick={() => cancelEdit()} className={styles.button}>Cancelar</button>
              </>
            ) : (
              <>
                <div className={styles.item_content}>
                  <div>{account.description}</div>
                  <div>{account.type}</div>
                </div>
                <div>
                  <button onClick={() => handleSetEditMode(account)} className={styles.button}>Editar</button>
                  <button onClick={() => handleDeleteAccount(account._id)} className={`${styles.button} ${styles.deleteButton}`}>Deletar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
