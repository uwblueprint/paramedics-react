import React from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const TriagePills = () => {
  const classes = useCompletePatientButtonStyles();
  return (
    <Container className={classes.root}>
      <Typography className={classes.label}>Triage</Typography>

      <ToggleButtonGroup
        value={"red"}
        exclusive
        onChange={""}
        aria-label="text alignment"
      >
        <ToggleButton
          variant="outlined"
          color="primary"
          value="red"
          disableRipple
          disableElevation
          classes={{
            root: classes.pill,
          }}
        >
          Red
        </ToggleButton>
      </ToggleButtonGroup>
    </Container>
  );
};

const useCompletePatientButtonStyles = makeStyles({
  root: {
    border: "1px solid #E8E8E8",
    boxSizing: "border-box",
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    padding: "0",
    marginBottom: "10px",
    maxHeight: "15vh",
    width: "100%",
    maxWidth: "100%",
    "& .MuiInput-formControl": {
      marginTop: "auto",
    },
  },
  label: {
    fontWeight: "bold",
    margin: "20px",
    color: "black",
    fontSize: "18px",
    display: "inline-block",
    transform: "translate(0, 1.5px) scale(0.75)",
  },
  pill: {
    borderLeft: "10px solid #FF5858",
    borderColor: "#FF5858",
    background: "rgba(255, 255, 255, 0.75)",
    "&:hover": {
      borderLeft: "10px solid #FF5858",
      borderColor: "#FF5858",
    },
    color: "black",
  },
});

export default TriagePills;
