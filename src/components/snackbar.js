// components/Snackbar.js

import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InfoIcon from '@mui/icons-material/Info';

const SnackbarComponent = ({ open, message, onClose }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);

    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Adjust timeout as needed (e.g., 2000 milliseconds for 2 seconds)

      return () => {
        clearTimeout(timer);
      };
    }
  }, [open, onClose]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar open={isOpen} autoHideDuration={2000} onClose={handleClose}>
      <MuiAlert
        elevation={6}
        icon={<InfoIcon fontSize="inherit" />}
        variant="standart"
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default SnackbarComponent;
