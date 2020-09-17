import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import { Colours } from '../../styles/Constants';

const useStepperStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
    padding: '0 88px 74px 88px',
    background: 'none',
  },
  dot: {
    boxSizing: 'border-box',
    width: '24px',
    height: '24px',
    marginRight: '24px',
    backgroundColor: Colours.White,
    border: `3.6369px solid ${Colours.Primary}`,
  },
  dotActive: {
    backgroundColor: Colours.Secondary,
  },
});

const Stepper: React.FC<{
  activeStep: number;
  nextButton: React.ReactNode;
  backButton?: React.ReactNode;
}> = ({
  activeStep,
  nextButton,
  backButton,
}: {
  activeStep: number;
  nextButton: React.ReactNode;
  backButton?: React.ReactNode;
}) => {
  const classes = useStepperStyles();

  return (
    <MobileStepper
      variant="dots"
      steps={2}
      position="static"
      activeStep={activeStep}
      classes={{
        root: classes.root,
        dot: classes.dot,
        dotActive: classes.dotActive,
      }}
      nextButton={nextButton}
      backButton={backButton}
    />
  );
};

export default Stepper;
