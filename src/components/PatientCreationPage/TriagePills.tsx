import React from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const TriagePills = ({
  currentStatus,
  handleChange,
}: {
  currentStatus: string;
  handleChange: (e: any) => any;
}) => {
  const classes = useCompletePatientButtonStyles();
  return (
    <Container className={classes.root}>
      <Typography className={classes.label}>Triage</Typography>

      <ToggleButtonGroup
        value={currentStatus}
        exclusive
        onChange={handleChange}
        aria-label="text alignment"
      >
        <ToggleButton
          value="red"
          classes={{
            root: classes.redpill,
          }}
        >
          Red
        </ToggleButton>
        <ToggleButton
          value="green"
          classes={{
            root: classes.greenpill,
          }}
        >
          Green
        </ToggleButton>

        <ToggleButton
          value="yellow"
          classes={{
            root: classes.yellowpill,
          }}
        >
          Yellow
        </ToggleButton>

        <ToggleButton
          value="White"
          classes={{
            root: classes.whitepill,
          }}
        >
          White
        </ToggleButton>

        <ToggleButton
          value="black"
          classes={{
            root: classes.blackpill,
          }}
        >
          Black
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
  redpill: {
    borderLeft: "10px solid #FF5858",
    borderColor: "#FF5858",
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: "10px solid #FF5858",
      borderColor: "#FF5858",
    },
    color: "black",
  },
  greenpill: {
    borderLeft: "10px solid #60CD39",
    borderColor: "#60CD39",
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: "10px solid #60CD39",
      borderColor: "#60CD39",
    },
    color: "black",
  },
  yellowpill: {
    borderLeft: "10px solid #FFC90A",
    borderColor: "#FFC90A",
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: "10px solid #FFC90A",
      borderColor: "#FFC90A",
    },
    color: "black",
  },
  whitepill: {
    borderLeft: "10px solid #FFFFFF",
    borderColor: "#C4C4C4",
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: "10px solid #FFFFFF",
      borderColor: "#C4C4C4",
    },
    color: "black",
  },
  blackpill: {
    borderLeft: "10px solid #000000",
    borderColor: "#000000",
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: "10px solid #000000",
      borderColor: "#000000",
    },
    color: "black",
  },
});

export default TriagePills;
