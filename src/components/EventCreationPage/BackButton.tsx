import React from "react";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";

const BackButton = ({ handleClick }: { handleClick: () => any | null }) => {
  const classes = useEventButtonStyles();
  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={handleClick}
      classes={{
        root: classes.root,
      }}
    >
      Back
    </Button>
  );
};

const useEventButtonStyles = makeStyles({
  root: {
    minWidth: "15rem",
    minHeight: "2.5rem",
    fontSize: "18px",
  },
});

export default BackButton;
