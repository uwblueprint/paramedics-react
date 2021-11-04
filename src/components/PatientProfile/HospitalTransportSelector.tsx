import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Typography,
  makeStyles,
  Radio,
  RadioGroup,
  FormControlLabel,
  Container,
  IconButton,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import HospitalAssignmentPage from './HospitalAssignmentPage';
import { Hospital } from '../../graphql/queries/hospitals';
import { Colours } from '../../styles/Constants';

const useRadioStyles = makeStyles({
  root: {
    display: 'block',
    padding: '20px',
    border: '1px solid #E8E8E8',
    boxSizing: 'border-box',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    marginBottom: '20px',
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
    display: 'block',
  },
  label: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: '18px',
    display: 'inline-block',
    transform: 'translate(0, 1.5px) scale(0.75)',
  },
  addLabel: {
    color: Colours.Secondary,
    display: 'inline',
    fontSize: '18px',
    fontWeight: 500,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  addRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  nameTitle: {
    display: 'flex',
    verticalAlign: 'middle',
    alignContent: 'center',
    alignItems: 'initial',
  },
});

const HospitalTransportSelector = ({
  options,
  currentValue,
  handleChange,
  setOpenHospitalAssignment,
}: {
  options: Array<Hospital>;
  currentValue: string;
  handleChange: (e: React.ChangeEvent<HTMLElement>) => void;
  setOpenHospitalAssignment: (boolean) => void;
}) => {
  const classes = useRadioStyles();

  return (
    <Container className={classes.root}>
      <span className={classes.nameTitle}>
        <Typography variant="body1" className={classes.label}>
          *Hospital Name:
        </Typography>
      </span>
      <RadioGroup
        className={classes.radioGroup}
        value={currentValue}
        onChange={handleChange}
      >
        {options.map((hospital) => (
          <FormControlLabel
            value={hospital.id}
            control={<Radio />}
            label={hospital.name}
            key={hospital.id}
          />
        ))}
        <div className={classes.addRow}>
          <IconButton>
            <AddIcon
              fontSize="large"
              style={{ color: Colours.Secondary }}
              onClick={() => {
                setOpenHospitalAssignment(true);
              }}
            />
          </IconButton>
          <Typography className={classes.addLabel}>
            Select Other Hospitals to Assign
          </Typography>
        </div>
      </RadioGroup>
    </Container>
  );
};

export default HospitalTransportSelector;
