import React from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { triageLevel } from "../../graphql/queries/templates/patients";

const TriagePills = ({
  currentStatus,
  handleChange,
}: {
  currentStatus: triageLevel | null;
  handleChange: (
    e: React.MouseEvent<HTMLElement>,
    newTriage: triageLevel
  ) => any;
}) => {
  const classes = useCompletePatientButtonStyles();
  return (
    <Container className={classes.root}>
      <Typography className={classes.label}>Triage:</Typography>

      <ToggleButtonGroup
        value={currentStatus}
        exclusive
        onChange={handleChange}
        aria-label="text alignment"
        classes={{
          groupedHorizontal: classes.buttonGroup,
        }}
      >
        <ToggleButton
          value={triageLevel.RED}
          classes={{
            root: classes.redpill,
          }}
        >
          Red
        </ToggleButton>
        <ToggleButton
          value={triageLevel.GREEN}
          classes={{
            root: classes.greenpill,
          }}
        >
          Green
        </ToggleButton>

        <ToggleButton
          value={triageLevel.YELLOW}
          classes={{
            root: classes.yellowpill,
          }}
        >
          Yellow
        </ToggleButton>

        <ToggleButton
          value={triageLevel.WHITE}
          classes={{
            root: classes.whitepill,
          }}
        >
          White
        </ToggleButton>

        <ToggleButton
          value={triageLevel.BLACK}
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
    borderLeft: "0.75rem solid #FF5858 !important",
    width: "6rem",
    borderColor: "#FF5858",
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: "0.75rem solid #FF5858",
      borderColor: "#FF5858",
    },
    color: "black",
  },
  greenpill: {
    borderLeft: "0.75rem solid #60CD39 !important",
    width: "6rem",
    borderColor: "#60CD39",
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: "0.75rem solid #60CD39",
      borderColor: "#60CD39",
    },
    color: "black",
  },
  yellowpill: {
    borderLeft: "0.75rem solid #FFC90A !important",
    width: "6rem",
    borderColor: "#FFC90A",
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: "0.75rem solid #FFC90A",
      borderColor: "#FFC90A",
    },
    "&:active": {
      background: "#FFC90A",
    },
    color: "black",
  },
  whitepill: {
    borderLeft: "0.75rem solid #CECECE !important",
    width: "6rem",
    borderColor: "#C4C4C4",
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: "0.75rem solid #CECECE",
      borderColor: "#C4C4C4",
    },
    color: "black",
  },
  blackpill: {
    borderLeft: "0.75rem solid #000000 !important",
    width: "6rem",
    borderColor: "#000000",
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: "0.75rem solid #000000",
      borderColor: "#000000",
    },
    color: "black",
  },
  buttonGroup: {
    "&:not(:first-child)": {
      borderLeft: "initial",
      borderRadius: "4px",
    },
    "&:not(:last-child)": {
      borderRadius: "4px",
    },
  },
});

export default TriagePills;
