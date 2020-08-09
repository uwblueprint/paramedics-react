import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { Ambulance } from '../../graphql/queries/ambulances';

const AmbulanceTransportSelector = ({
  options,
  currentValue,
  handleChange,
}: {
  options: Array<Ambulance>;
  currentValue: string;
  handleChange: (e: React.ChangeEvent<HTMLElement>) => void;
}) => {
  return (
    <>
      <Typography variant="h6" style={{ marginBottom: 20 }}>
        Ambulance
      </Typography>
      <RadioGroup
        value={currentValue}
        onChange={handleChange}
        style={{ marginBottom: 32 }}
      >
        {options.map((ambulance) => (
          <FormControlLabel
            value={ambulance.id}
            control={<Radio />}
            label={`#${ambulance.vehicleNumber}`}
            key={ambulance.id}
          />
        ))}
      </RadioGroup>
    </>
  );
};

export default AmbulanceTransportSelector;
