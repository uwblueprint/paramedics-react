import React from 'react';

import { makeStyles, Button } from '@material-ui/core';

const useStyles = makeStyles({
  addButton: {
    padding: '12px 23px',
  },
});

const LoginButton = () => {
  const classes = useStyles();
  const handleLogin = () => {
    fetch('http://localhost:4000/login');
  };
  return (
    <Button
      variant="contained"
      color="secondary"
      className={classes.addButton}
      onClick={handleLogin}
    >
      Log in
    </Button>
  );
};

export default LoginButton;
