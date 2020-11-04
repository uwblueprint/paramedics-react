import React from 'react';
import { makeStyles, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Colours } from '../../styles/Constants';

const useStyles = makeStyles({
  addButton: {
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    borderRadius: '2000px',
    position: 'fixed',
    bottom: '56px',
    right: '56px',
    padding: '12px 26px',
  },
});

const AddPinButton = ({ handleClick }: { handleClick: () => void }) => {
  const classes = useStyles();
  return (
    <Button
      className={classes.addButton}
      variant="contained"
      color="secondary"
      onClick={handleClick}
    >
      <AddIcon style={{ color: Colours.White, marginRight: '9px' }} />
      Add Pin
    </Button>
  );
};

export default AddPinButton;
