import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";

export default function Stepper({
  activeStep,
  nextButton,
  backButton,
}: {
  activeStep: number;
  nextButton: React.ReactNode;
  backButton?: React.ReactNode;
}) {
  const classes = useStepperStyles();
  const theme = useTheme();

  return (
    <MobileStepper
      variant="dots"
      steps={2}
      position="static"
      activeStep={activeStep}
      classes={{
        root: classes.root,
        dots: classes.dots,
        dot: classes.dot,
        dotActive: classes.dotActive,
      }}
      nextButton={nextButton}
      backButton={backButton}
    />
  );
}

const useStepperStyles = makeStyles({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
  dots: {
    position: "absolute",
    left: "4rem",
    bottom: "4rem",
  },
  dot: {
    width: "1rem",
    height: "1rem",
    backgroundColor: "#FFFFFF",
    border: "3.6369px solid #05162F",
  },
  dotActive: {
    backgroundColor: "#05162F",
  },
});
