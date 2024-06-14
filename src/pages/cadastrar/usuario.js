import withAuth from '@/hoc/withAuth';
import React from 'react';

const Usuario = () => {
  return (
    <div>
      Informações da Usuario
    </div>
  );
};

export default withAuth(Usuario);
