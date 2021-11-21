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
    // TODO: Replace backend URL with environment variable
    window.location.href = 'http://localhost:4000/login';
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
