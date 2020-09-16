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
    marginBottom: '20px',
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

const RadioSelector = ({
  labels,
  currentValue,
  handleChange,
}: {
  labels: Array<string>;
  currentValue: string;
  handleChange: (e: React.ChangeEvent<HTMLElement>) => void;
}) => {
  const classes = useRadioStyles();

  return (
    <Container className={classes.root}>
      <Typography className={classes.label}>Gender:</Typography>
      <RadioGroup
        row
        aria-label="position"
        name="position"
        value={currentValue}
        onChange={handleChange}
        className={classes.radioGroup}
      >
        {labels.map((label) => (
          <FormControlLabel
            value={label}
            control={<Radio color="secondary" />}
            label={label}
            labelPlacement="end"
            key={label}
          />
        ))}
      </RadioGroup>
    </Container>
  );
};

export default RadioSelector;
