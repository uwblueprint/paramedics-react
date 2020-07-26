import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import { Hospital } from '../../graphql/queries/hospitals';

const HospitalTransportSelector = ({
    options,
    currentValue,
    handleChange,
}: {
    options: Array<Hospital>,
    currentValue: string;
    handleChange: (e: React.ChangeEvent<HTMLElement>) => void;
}) => {
    return (
        <>
            <FormLabel>Hospital</FormLabel>
            <RadioGroup value={currentValue} onChange={handleChange}>
                {options.map((hospital) => (
                    <FormControlLabel value={hospital.id} control={<Radio />} label={hospital.name} />
                ))}
            </RadioGroup>
        </>

    );
}

export default HospitalTransportSelector;
