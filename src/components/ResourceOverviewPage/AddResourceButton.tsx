import React from "react";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink, BrowserRouter } from "react-router-dom";


interface ButtonType {
    label: string
    route: string
}

const useButtonStyles = makeStyles({
  root: {
    borderRadius: "3rem",
    minWidth: "15rem",
  },
});

const AddResourceButton = ({label, route}: ButtonType) => {
  const classes = useButtonStyles();
  return (
    <Button
      component={NavLink}
      to={route}
      variant="contained"
      color="secondary"
      startIcon={<AddIcon />}
      classes={{
        root: classes.root,
      }}
    >
        {label}
    </Button>
  );
};

export default AddResourceButton;