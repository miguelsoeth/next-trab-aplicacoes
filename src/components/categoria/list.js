// components/CategoriesList.js
import React from 'react';
import CategoryItem from './item';
import styles from '@/styles/Crud.module.css';

const CategoriesList = ({ categories, onEdit, onDelete }) => {
  return (
    <ul className={styles.list}>
      {categories.map(category => (
        <CategoryItem key={category._id} category={category} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default CategoriesList;
