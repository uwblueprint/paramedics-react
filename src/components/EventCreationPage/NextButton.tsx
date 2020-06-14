import React from "react";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";

const NextButton = ({
  handleClick,
  disabled,
}: {
  handleClick: () => any | null;
  disabled: boolean;
}) => {
  const classes = useEventButtonStyles();
  console.log(disabled);
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      classes={{
        root: classes.root,
        disabled: classes.disabled,
      }}
      disabled={disabled}
    >
      Next
    </Button>
  );
};

const useEventButtonStyles = makeStyles({
  root: {
    minWidth: "15rem",
    minHeight: "2.5rem",
    fontSize: "18px",
  },
  disabled: {
    cursor: "not-allowed !important",
    "pointer-events": "all !important",
  },
});

export default NextButton;
