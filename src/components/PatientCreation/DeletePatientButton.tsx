import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Colours } from '../../styles/Constants';

const useDeletePatientButtonStyles = makeStyles({
  root: {
    minWidth: '15rem',
    float: 'left',
    color: Colours.Danger,
    '&:hover': {
      color: Colours.DangerHover,
    },
  },
});

const DeletePatientButton = () => {
  const classes = useDeletePatientButtonStyles();
  return (
    <Button
      variant="contained"
      classes={{
        root: classes.root,
      }}
      type="submit"
    >
      Delete
    </Button>
  );
};

export default DeletePatientButton;
