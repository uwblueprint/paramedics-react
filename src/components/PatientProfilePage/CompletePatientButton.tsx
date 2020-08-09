import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useCompletePatientButtonStyles = makeStyles({
  root: {
    borderRadius: '3rem',
    minWidth: '15rem',
    margin: '10px 0px',
    position: 'relative',
    left: '75%',
  },
});

const CompletePatientButton = () => {
  const classes = useCompletePatientButtonStyles();
  return (
    <Button
      variant="contained"
      color="secondary"
      classes={{
        root: classes.root,
      }}
      type="submit"
    >
      Complete
    </Button>
  );
};

export default CompletePatientButton;
