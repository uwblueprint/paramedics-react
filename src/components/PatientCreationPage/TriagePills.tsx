import React from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { triageLevel } from "../../graphql/queries/templates/patients";
import { Colours } from "../../styles/Constants";

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
    borderLeft: `0.75rem solid ${Colours.TriageRed}!important`,
    width: "6rem",
    borderColor: `${Colours.TriageRed}`,
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: `0.75rem solid ${Colours.TriageRed}`,
      borderColor: `${Colours.TriageRed}`,
    },
    color: "black",
  },
  selectedRedPill: {
    color: "black !important",
    backgroundColor: `${Colours.TriageSelectedRed} !important`,
    fontWeight: "bold",
  },
  greenpill: {
    borderLeft: `0.75rem solid ${Colours.TriageGreen} !important`,
    width: "6rem",
    borderColor: `${Colours.TriageGreen}`,
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: `0.75rem solid ${Colours.TriageGreen}`,
      borderColor: `${Colours.TriageGreen}`,
    },
    color: "black",
  },
  selectedGreenPill: {
    color: "black !important",
    backgroundColor: `${Colours.TriageSelectedGreen} !important`,
    fontWeight: "bold",
  },
  yellowpill: {
    borderLeft: `0.75rem solid ${Colours.TriageYellow} !important`,
    width: "6rem",
    borderColor: `${Colours.TriageYellow}`,
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: `0.75rem solid ${Colours.TriageYellow}`,
      borderColor: `${Colours.TriageYellow}`,
    },
    color: "black",
  },
  selectedYellowPill: {
    color: "black !important",
    backgroundColor: `${Colours.TriageSelectedYellow} !important`,
    fontWeight: "bold",
  },
  whitepill: {
    borderLeft: `0.75rem solid ${Colours.TriageWhite} !important`,
    width: "6rem",
    borderColor: "#C4C4C4",
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: `0.75rem solid ${Colours.TriageWhite}`,
      borderColor: "#C4C4C4",
    },
    color: "black",
  },
  selectedWhitePill: {
    color: "black !important",
    backgroundColor: `${Colours.TriageSelectedWhite} !important`,
    fontWeight: "bold",
  },
  blackpill: {
    borderLeft: `0.75rem solid ${Colours.TriageBlack} !important`,
    width: "6rem",
    borderColor: `${Colours.TriageBlack}`,
    background: "rgba(255, 255, 255, 0.75)",
    marginRight: "20px",
    "&:hover": {
      borderLeft: `0.75rem solid ${Colours.TriageBlack}`,
      borderColor: `${Colours.TriageBlack}`,
    },
    color: "black",
  },
  selectedBlackPill: {
    color: "black !important",
    backgroundColor: `${Colours.TriageSelectedBlack} !important`,
    fontWeight: "bold",
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
