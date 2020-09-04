import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useCompletePatientButtonStyles = makeStyles({
  root: {
    borderRadius: '4px',
    minWidth: '230px',
    margin: '10px 0px',
    display: 'flex',
    marginLeft: 'auto',
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
