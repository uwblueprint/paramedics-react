import React from 'react';
import { NavLink } from 'react-router-dom';
import { Typography, makeStyles, Button, Dialog, Box } from '@material-ui/core';
import HospitalTransportSelector from './HospitalTransportSelector';
import AmbulanceTransportSelector from './AmbulanceTransportSelector';
import NextButton from '../EventCreation/NextButton';
import BackButton from '../common/BackButton';
import Stepper from '../EventCreation/Stepper';
import { Colours } from '../../styles/Constants';
import { Hospital } from '../../graphql/queries/hospitals';
import { Ambulance } from '../../graphql/queries/ambulances';
import { CCP } from '../../graphql/queries/ccps';
import FormField from '../common/FormField';
import DropdownField from './DropdownField';

const useStyles = makeStyles({
  resourceWrapper: {
    backgroundColor: Colours.White,
    position: 'relative',
  },
  resourceCreationTopSection: {
    margin: '48px 30px 0px 30px',
    backgroundColor: Colours.White,
    borderBottom: `1px solid ${Colours.BorderLightGray}`,
  },
  resourceHeader: {
    display: 'flex',
    padding: '16px 0px',
    justifyContent: 'space-between',
  },
  resourceForm: {
    padding: '0px',
  },
  confirmButton: {
    minWidth: '160px',
    minHeight: '40px',
    fontSize: '18px',
    marginLeft: '20px',
  },
  cancelButton: {
    minWidth: '228px',
    fontSize: '18px',
    alignSelf: 'center',
  },
  icon: {
    fontSize: '18px',
    padding: '0px 5px 0px 20px',
  },
  caption: {
    marginTop: '32px',
    marginBottom: '46px',
  },
});

const HospitalAssignmentPage = ({
  open,
  handleClose,
  handleSubmit,
  hospitals,
  handleHospitalChange,
  handleAddHospital
}: {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (selectedHospital: any) => void;
  hospitals: Hospital[];
  handleHospitalChange: (e: any) => void;
  handleAddHospital: (hospitalName: string) => void;
}) => {
  const [isAddHospital, setAddHospital] = React.useState(false);
  const [hospitalName, setHospitalName] = React.useState('');
  const [selectedHospital, setSelectedHospital] = React.useState('');
  const [isValidatedSaveChanges, setIsValidatedSaveChanges] = React.useState(false);
  const classes = useStyles();
  const onHospitalNameChange = (e) => {
    setHospitalName(e.target.value);
  };

  const onHospitalOptionChange = (e) => {
    setSelectedHospital(e.target.value);
    if (e.target.value === 'Add hospital') {
      setAddHospital(true);
    } else {
      setAddHospital(false);
    }
  };

  const onSaveChanges = () => {

    if (isAddHospital) {
      handleAddHospital(hospitalName);

    } else { 
      handleSubmit(selectedHospital);
      handleHospitalChange({ target: { value: selectedHospital }});
    }
  };

  return (
    <Dialog fullScreen open={open} onClose={() => {}}>
      <Box
        display="flex"
        justifyContent="space-between"
        padding="56px 56px 36px 56px"
        borderBottom={`1px solid ${Colours.BorderLightGray}`}
      >
        <Typography variant="h4">Select A Hospital To Assign</Typography>
        <Button
          color="secondary"
          variant="outlined"
          className={classes.cancelButton}
          onClick={handleClose}
        >
          Cancel
        </Button>
      </Box>
      <Box padding="56px">
        <Typography
          variant="caption"
          style={{ display: 'inline-block', marginBottom: '35px' }}
          color="textSecondary"
        >
          Assignment of hospital will change the hospital status from INACTIVE
          to ACTIVE.
        </Typography>
        <DropdownField
          onChangeAction={setAddHospital}
          options={hospitals}
          defaultText="Select hospital"
          actionText="Add hospital"
          label="*Hospital Name:"
          optionValue="id"
          optionLabel="name"
          selected={selectedHospital}
          onChange={onHospitalOptionChange}
        />
        {isAddHospital ? (
          <FormField
            label="*Hospital Name"
            isValidated={true}
            validators={['matchRegexp:.*[^ ].*']}
            errorMessages={[
              'Invalid input',
            ]}
            placeholder="Enter hospital name"
            onChange={onHospitalNameChange}
            value={hospitalName}
            onValid={(isValid) => { setIsValidatedSaveChanges(isValid) }}
          />
        ) : null}
        <div style={{ textAlign: 'right', marginTop: '36px' }}>
          <NextButton
            handleClick={onSaveChanges}
            disabled={hospitalName.length === 0 || !isValidatedSaveChanges}
            buttonText="SAVE CHANGES"
          />
        </div>
      </Box>
    </Dialog>
  );
};

export default HospitalAssignmentPage;
