import React from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
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
  buttonIcon: {
    marginRight: '13px',
  },
});

const AddPinButton = ({ handleClick }: { handleClick: () => void }) => {
  const classes = useStyles();
  return (
    <div>
      <Button
        className={classes.addButton}
        variant="contained"
        color="secondary"
        onClick={handleClick}
      >
        <Add className={classes.buttonIcon} />
        Add Pin
      </Button>
    </div>
  );
};

export default AddPinButton;
