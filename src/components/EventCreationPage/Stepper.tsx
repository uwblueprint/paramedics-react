import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const useStyles = makeStyles({
    root: {
        maxWidth: 400,
        flexGrow: 1,
    },
});

export default function Stepper({ activeStep, nextButton, backButton }: { activeStep: number, nextButton: React.ReactNode, backButton?: React.ReactNode }) {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <MobileStepper
            variant="dots"
            steps={2}
            position="static"
            activeStep={activeStep}
            className={classes.root}
            nextButton={

                nextButton}
            backButton={
                backButton
            }
        />)
}
