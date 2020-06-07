import React from "react";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";

const NextButton = ({ handleClick }: { handleClick: () => any | null; }) => {
  const classes = useEventButtonStyles();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      classes={{
        root: classes.root,
      }}
    >
      Next
    </Button>
  );
};

const useEventButtonStyles = makeStyles({
  root: {
    minWidth: "13rem",
  },
});

export default NextButton;
