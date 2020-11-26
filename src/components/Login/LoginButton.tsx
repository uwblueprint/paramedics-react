import React from 'react';

import { makeStyles, Button } from '@material-ui/core';

const useStyles = makeStyles({
  addButton: {
    padding: '12px 23px',
  },
});

const LoginButton = () => {
  const classes = useStyles();
  return (
    <Button variant="contained" color="secondary" className={classes.addButton}>
      Log in
    </Button>
  );
};

export default LoginButton;
