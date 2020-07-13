import React from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { TriageLevel } from '../../graphql/queries/patients';
import Colours from '../../styles/Constants';

const useCompletePatientButtonStyles = makeStyles({
  root: {
    border: '1px solid #E8E8E8',
    boxSizing: 'border-box',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    padding: '0',
    marginBottom: '10px',
    maxHeight: '15vh',
    width: '100%',
    maxWidth: '100%',
    '& .MuiInput-formControl': {
      marginTop: 'auto',
    },
  },
  label: {
    fontWeight: 'bold',
    margin: '20px',
    color: 'black',
    fontSize: '18px',
    display: 'inline-block',
    transform: 'translate(0, 1.5px) scale(0.75)',
  },
  redpill: {
    borderLeft: `0.75rem solid ${Colours.TriageRed}!important`,
    width: '6rem',
    borderColor: `${Colours.TriageRed}`,
    background: 'rgba(255, 255, 255, 0.75)',
    marginRight: '20px',
    '&:hover': {
      borderLeft: `0.75rem solid ${Colours.TriageRed}`,
      borderColor: `${Colours.TriageRed}`,
    },
    color: 'black',
  },
  selectedRedPill: {
    color: 'black !important',
    backgroundColor: `${Colours.TriageSelectedRed} !important`,
    fontWeight: 'bold',
  },
  greenpill: {
    borderLeft: `0.75rem solid ${Colours.TriageGreen} !important`,
    width: '6rem',
    borderColor: `${Colours.TriageGreen}`,
    background: 'rgba(255, 255, 255, 0.75)',
    marginRight: '20px',
    '&:hover': {
      borderLeft: `0.75rem solid ${Colours.TriageGreen}`,
      borderColor: `${Colours.TriageGreen}`,
    },
    color: 'black',
  },
  selectedGreenPill: {
    color: 'black !important',
    backgroundColor: `${Colours.TriageSelectedGreen} !important`,
    fontWeight: 'bold',
  },
  yellowpill: {
    borderLeft: `0.75rem solid ${Colours.TriageYellow} !important`,
    width: '6rem',
    borderColor: `${Colours.TriageYellow}`,
    background: 'rgba(255, 255, 255, 0.75)',
    marginRight: '20px',
    '&:hover': {
      borderLeft: `0.75rem solid ${Colours.TriageYellow}`,
      borderColor: `${Colours.TriageYellow}`,
    },
    color: 'black',
  },
  selectedYellowPill: {
    color: 'black !important',
    backgroundColor: `${Colours.TriageSelectedYellow} !important`,
    fontWeight: 'bold',
  },
  whitepill: {
    borderLeft: `0.75rem solid ${Colours.TriageWhite} !important`,
    width: '6rem',
    borderColor: '#C4C4C4',
    background: 'rgba(255, 255, 255, 0.75)',
    marginRight: '20px',
    '&:hover': {
      borderLeft: `0.75rem solid ${Colours.TriageWhite}`,
      borderColor: '#C4C4C4',
    },
    color: 'black',
  },
  selectedWhitePill: {
    color: 'black !important',
    backgroundColor: `${Colours.TriageSelectedWhite} !important`,
    fontWeight: 'bold',
  },
  blackpill: {
    borderLeft: `0.75rem solid ${Colours.TriageBlack} !important`,
    width: '6rem',
    borderColor: `${Colours.TriageBlack}`,
    background: 'rgba(255, 255, 255, 0.75)',
    marginRight: '20px',
    '&:hover': {
      borderLeft: `0.75rem solid ${Colours.TriageBlack}`,
      borderColor: `${Colours.TriageBlack}`,
    },
    color: 'black',
  },
  selectedBlackPill: {
    color: 'black !important',
    backgroundColor: `${Colours.TriageSelectedBlack} !important`,
    fontWeight: 'bold',
  },
  buttonGroup: {
    '&:not(:first-child)': {
      borderLeft: 'initial',
      borderRadius: '4px',
    },
    '&:not(:last-child)': {
      borderRadius: '4px',
    },
  },
});

const TriagePills = ({
  currentStatus,
  handleChange,
}: {
  currentStatus: TriageLevel | null;
  handleChange: (
    e: React.MouseEvent<HTMLElement>,
    newTriage: TriageLevel
  ) => void;
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
        {Object.keys(TriageLevel).map((level) => (
          <ToggleButton
            value={level}
            key={level}
            classes={{
              root: classes[`${level.toLowerCase()}pill`],
              selected:
                classes[
                  `selected${
                    level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
                  }Pill`
                ],
            }}
          >
            <Typography variant="body2">{level}</Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Container>
  );
};

export default TriagePills;
