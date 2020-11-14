import React from 'react';
import Button from '@material-ui/core/Button';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useCancelButtonStyles = makeStyles({
  root: {
    minWidth: '228px',
    fontSize: '18px',
    alignSelf: 'center',
  },
});

const CancelButton = ({ to }: { to: string }) => {
  const classes = useCancelButtonStyles();
  return (
    <Button
      color="secondary"
      variant="outlined"
      classes={{
        root: classes.root,
      }}
      component={NavLink}
      to={to}
    >
      Cancel
    </Button>
  );
};

export default CancelButton;
