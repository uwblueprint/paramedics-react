import React from "react";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";

const useEventButtonStyles = makeStyles({
  root: {
    borderRadius: "3rem",
    minWidth: "15rem",
  },
});

const AddMemberButton = () => {
  const classes = useEventButtonStyles();
  return (
    <Button
      component={NavLink}
      to="/events/new"
      variant="contained"
      color="secondary"
      startIcon={<AddIcon />}
      classes={{
        root: classes.root,
      }}
    >
      Add Team Member
    </Button>
  );
};

export default AddMemberButton;