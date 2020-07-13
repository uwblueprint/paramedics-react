import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const CompletePatientButton = ({
  handleClick,
}: {
  handleClick: () => any | null;
}) => {
  const classes = useCompletePatientButtonStyles();
  return (
    <Button
      variant="contained"
      color="secondary"
      classes={{
        root: classes.root,
      }}
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
