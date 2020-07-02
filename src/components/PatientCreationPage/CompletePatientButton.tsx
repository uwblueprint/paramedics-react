import React from "react";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";

const CompletePatientButton = ({
  handleClick,
}: // disableButton,
{
  handleClick: () => any | null;
  // disableButton: boolean;
}) => {
  const classes = useCompletePatientButtonStyles();
  return (
    <Button
      component={NavLink}
      to="/"
      onClick={handleClick}
      variant="contained"
      color="primary"
      classes={{
        root: classes.root,
      }}
      // disabled={disableButton}
    >
      Complete
    </Button>
  );
};

const useCompletePatientButtonStyles = makeStyles({
  root: {
    borderRadius: "3rem",
    minWidth: "15rem",
    float: "right",
  },
});

export default CompletePatientButton;
