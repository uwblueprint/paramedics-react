import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Colours } from '../../styles/Constants';

const useDeletePatientButtonStyles = makeStyles({
  root: {
    minWidth: '15rem',
    float: 'left',
    color: Colours.White,
    backgroundColor: Colours.Danger,
    '&:hover': {
      backgroundColor: Colours.DangerHover,
    },
  },
});

const DeletePatientButton = ({ handleClick }: { handleClick: () => void }) => {
  const classes = useDeletePatientButtonStyles();
  return (
    <Button
      variant="contained"
      onClick={handleClick}
      classes={{
        root: classes.root,
      }}
    >
      Delete
    </Button>
  );
};

export default DeletePatientButton;
