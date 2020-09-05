import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { Hospital } from '../../graphql/queries/hospitals';

const HospitalTransportSelector = ({
  options,
  currentValue,
  handleChange,
}: {
  options: Array<Hospital>;
  currentValue: string;
  handleChange: (e: React.ChangeEvent<HTMLElement>) => void;
}) => {
  return (
    <>
      <Typography variant="h6" style={{ marginBottom: '20px' }}>
        Hospital
      </Typography>
      <RadioGroup
        value={currentValue}
        onChange={handleChange}
        style={{ marginBottom: '32px' }}
      >
        {options.map((hospital) => (
          <FormControlLabel
            value={hospital.id}
            control={<Radio />}
            label={hospital.name}
            key={hospital.id}
          />
        ))}
      </RadioGroup>
    </>
  );
};

export default HospitalTransportSelector;
