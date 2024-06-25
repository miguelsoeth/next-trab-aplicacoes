// pages/categories.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setAuthHeader } from '@/utils/authenticate';
import styles from '@/styles/Crud.module.css';
import withAuth from '@/hoc/withAuth';
import CategoryForm from '@/components/categoria/form';
import CategoriesList from '@/components/categoria/list';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);

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

  const handleCreateCategory = async (newCategory) => {
    try {
      await axios.post('http://localhost:8080/api/categories', newCategory);
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Deseja mesmo deletar essa categoria?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/categories/${categoryId}`);
      setCategories(categories.filter(category => category._id !== categoryId));
    } catch (error) {
      console.error(`Error deleting category ${categoryId}:`, error);
    }
  };

  const handleEditCategory = async (categoryId, updatedCategory) => {
    if (!window.confirm("Deseja mesmo editar essa categoria?")) {
      return;
    }
    try {
      await axios.put(`http://localhost:8080/api/categories/${categoryId}`, updatedCategory);
      fetchCategories();
    } catch (error) {
      console.error(`Error updating category ${categoryId}:`, error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Categorias</h1>
      <CategoryForm onCreate={handleCreateCategory} />
      <CategoriesList categories={categories} onEdit={handleEditCategory} onDelete={handleDeleteCategory} />
    </div>
  );
};

export default withAuth(CategoriesPage);
