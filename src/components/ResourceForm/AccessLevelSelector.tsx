import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';

const useRadioStyles = makeStyles({
  root: {
    border: '1px solid #E8E8E8',
    boxSizing: 'border-box',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    padding: '0',
    marginTop: '0px',
    marginBottom: '24px',
    maxHeight: '15vh',
    width: '100%',
    maxWidth: '100%',
    '& .MuiInput-formControl': {
      marginTop: 'auto',
    },
    '& label.Mui-focused': {
      color: '#2E5584',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#2E5584',
    },
  },
  radioGroup: {
    display: 'inline-block',
  },
  label: {
    fontWeight: 'bold',
    margin: '20px',
    color: 'black',
    fontSize: '18px',
    display: 'inline-block',
    transform: 'translate(0, 1.5px) scale(0.75)',
  },
});

const AccessLevelSelector = ({
  currentValue,
  handleChange,
}: {
  currentValue: string;
  handleChange: (e: any) => any;
}) => {
  const classes = useRadioStyles();
  const accessLevels = [
    { label: 'Commander', roleId: 1 },
    { label: 'Supervisor', roleId: 2 },
    { label: 'Dispatch', roleId: 3 },
  ];
  return (
    <Container className={classes.root}>
      <Typography className={classes.label}>*Role:</Typography>
      <RadioGroup
        row
        aria-label="position"
        name="position"
        value={currentValue}
        onChange={handleChange}
        className={classes.radioGroup}
      >
        {accessLevels.map((accessLevel) => (
          <FormControlLabel
            value={accessLevel.roleId.toString()}
            control={<Radio color="secondary" />}
            label={accessLevel.label}
            labelPlacement="end"
            key={accessLevel.roleId}
          />
        ))}
      </RadioGroup>
    </Container>
  );
};

export default AccessLevelSelector;
