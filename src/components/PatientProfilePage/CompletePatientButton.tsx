import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useCompletePatientButtonStyles = makeStyles({
  root: {
    minWidth: '230px',
    margin: '10px 0px',
    float: 'right',
    display: 'flex',
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
