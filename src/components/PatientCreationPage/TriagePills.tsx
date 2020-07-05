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
  error,
  helperText,
}: {
  currentStatus: triageLevel | null;
  handleChange: (
    e: React.MouseEvent<HTMLElement>,
    newTriage: triageLevel
  ) => any;
  error?: boolean;
  helperText?: string;
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
            selected: classes.selectedRedPill,
          }}
        >
          <Typography variant="body2">Red</Typography>
        </ToggleButton>
        <ToggleButton
          value={triageLevel.GREEN}
          classes={{
            root: classes.greenpill,
            selected: classes.selectedGreenPill,
          }}
        >
          <Typography variant="body2">Green</Typography>
        </ToggleButton>

        <ToggleButton
          value={triageLevel.YELLOW}
          classes={{
            root: classes.yellowpill,
            selected: classes.selectedYellowPill,
          }}
        >
          <Typography variant="body2">Yellow</Typography>
        </ToggleButton>

        <ToggleButton
          value={triageLevel.WHITE}
          classes={{
            root: classes.whitepill,
            selected: classes.selectedWhitePill,
          }}
        >
          <Typography variant="body2">White</Typography>
        </ToggleButton>

        <ToggleButton
          value={triageLevel.BLACK}
          classes={{
            root: classes.blackpill,
            selected: classes.selectedBlackPill,
          }}
        >
          <Typography variant="body2">Black</Typography>
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
  selectedRedPill: {
    color: "black !important",
    backgroundColor: "#FFE4E4 !important",
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
  selectedGreenPill: {
    color: "black !important",
    backgroundColor: "#60CD39 !important",
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
  selectedYellowPill: {
    color: "black !important",
    backgroundColor: "#FFC90A !important",
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
  selectedWhitePill: {
    color: "black !important",
    backgroundColor: "#C4C4C4 !important",
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
  selectedBlackPill: {
    color: "black !important",
    backgroundColor: "#000000 !important",
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
