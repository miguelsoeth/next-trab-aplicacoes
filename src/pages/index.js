// Home.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css'; 
import withAuth from '../hoc/withAuth';
import Clock from '@/components/clock';
import { Card, CardContent } from '@mui/material';

const Home = () => {

  useEffect(() => {

  }, []);

  return (
    <>      
      <Card elevation={8} className={styles.card}>
        <CardContent className={styles.cardContent}>
          <span className={styles.welcome}>Bem vindo!</span>
          <Clock />
        </CardContent>
      </Card>
    </>
  );
};

export default withAuth(Home);
