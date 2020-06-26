import React from "react";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";

const CompletePatientButton = ({
  handleClick,
}: {
  handleClick: () => any | null;
}) => {
  const classes = useCompletePatientButtonStyles();
  return (
    <Button
      component={NavLink}
      to="/"
      variant="contained"
      color="primary"
      classes={{
        root: classes.root,
      }}
    >
      Complete
    </Button>
  );
};

const useCompletePatientButtonStyles = makeStyles({
  root: {
    borderRadius: "3rem",
    minWidth: "15rem",
  },
});

export default CompletePatientButton;
