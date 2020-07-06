import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const CompletePatientButton = ({
  handleClick,
  disableButton,
}: {
  handleClick: () => any | null;
  disableButton: boolean;
}) => {
  const classes = useCompletePatientButtonStyles();
  return (
    <Button
      variant="contained"
      color="secondary"
      classes={{
        root: classes.root,
      }}
      disabled={disableButton}
      type="submit"
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
