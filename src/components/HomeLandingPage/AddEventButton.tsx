import React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';

type AddEventButton = () => JSX.Element;

const useEventButtonStyles = makeStyles({
  root: {
    borderRadius: '3rem',
    minWidth: '15rem',
  },
});

const AddEventButton: AddEventButton = () => {
  const classes = useEventButtonStyles();
  return (
    <Button
      component={NavLink}
      to="/events/new"
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      classes={{
        root: classes.root,
      }}
    >
      Add New Event
    </Button>
  );
};

export default AddEventButton;
