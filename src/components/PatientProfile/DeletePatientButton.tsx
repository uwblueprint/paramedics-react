import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Colours } from '../../styles/Constants';

const useDeletePatientButtonStyles = makeStyles({
  root: {
    minWidth: '230px',
    margin: '10px 0px 58px 0px',
    float: 'left',
    display: 'flex',
    color: Colours.White,
    backgroundColor: Colours.Danger,
    '&:hover': {
      backgroundColor: Colours.DangerHover,
    },
  },
});

const DeletePatientButton = ({
  handleClick,
  buttonStyle,
}: {
  handleClick: () => void;
  buttonStyle?: Object;
}) => {
  const classes = useDeletePatientButtonStyles();

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      classes={{
        root: classes.root,
      }}
      style={buttonStyle}
    >
      Delete Patient
    </Button>
  );
};

export default DeletePatientButton;
