import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import { Ambulance } from '../../graphql/queries/ambulances';

const AmbulanceTransportSelector = ({
    options,
    currentValue,
    handleChange,
}: {
    options: Array<Ambulance>,
    currentValue: string;
    handleChange: (e: React.ChangeEvent<HTMLElement>) => void;
}) => {
    return (
        <>
            <FormLabel>Ambulance</FormLabel>
            <RadioGroup value={currentValue} onChange={handleChange}>
                {options.map((ambulance) => (
                    <FormControlLabel value={ambulance.id} control={<Radio />} label={`#${ambulance.vehicleNumber}`} />
                ))}
            </RadioGroup>
        </>

    );
}

export default AmbulanceTransportSelector;
