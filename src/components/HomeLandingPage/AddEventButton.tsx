import React from "react";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";

const AddEventButton = () => {
  const classes = useEventButtonStyles();
  return (
    <Button
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

const useEventButtonStyles = makeStyles({
  root: {
    borderRadius: "3rem",
    minWidth: "13rem",
  },
});

export default AddEventButton;
