import React from 'react';
import { Typography, makeStyles, Button, Dialog, Box } from '@material-ui/core';
import NextButton from '../EventCreation/NextButton';
import { Colours } from '../../styles/Constants';
import { Ambulance } from '../../graphql/queries/ambulances';
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

const AmbulanceAssignmentPage = ({
  open,
  handleClose,
  handleSubmit,
  ambulances,
  handleAmbulanceChange,
  handleAddAmbulance
}: {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (newAmbulance: any) => void;
  ambulances: Ambulance[];
  handleAmbulanceChange: (e: any) => void;
  handleAddAmbulance: (ambulanceNumber: string) => void;
}) => {
  const [isAddAmbulance, setAddAmbulance] = React.useState(false);
  const [ambulanceNumber, setambulanceNumber] = React.useState('');
  const [selectedAmbulanceNumber, setSelectedAmbulanceNumber] = React.useState('');
  const classes = useStyles();

  const isNotValidatedSaveChanges = false;

  const onAmbulanceNumberChange = (e) => {
    setambulanceNumber(e.target.value);
  };

  const onAmbulanceOptionChange = (e) => {
    setSelectedAmbulanceNumber(e.target.value);
    if (e.target.value === 'Add ambulance') {
      setAddAmbulance(true);
    } else {
      setAddAmbulance(false);
    }
  };

  const onSaveChanges = () => {

    if (isAddAmbulance) {
      handleAddAmbulance(ambulanceNumber);
    } else { 
      handleSubmit(selectedAmbulanceNumber);
      handleAmbulanceChange({ target: { value: selectedAmbulanceNumber }})
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
        <Typography variant="h4">Select An Ambulance To Assign</Typography>
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
          Assignment of ambulance will change the ambulance status from INACTIVE
          to ACTIVE.
        </Typography>
        <DropdownField
          onChangeAction={setAddAmbulance}
          options={ambulances}
          defaultText="Select ambulance"
          actionText="Add ambulance"
          label="*Ambulance Number:"
          optionValue="id"
          optionLabel="vehicleNumber"
          selected={selectedAmbulanceNumber}
          onChange={onAmbulanceOptionChange}
        />
        {isAddAmbulance ? (
          <FormField
            label="*Ambulance Number"
            placeholder="Enter ambulance number"
            isValidated={false}
            onChange={onAmbulanceNumberChange}
            value={ambulanceNumber}
          />
        ) : null}
        <div style={{ textAlign: 'right', marginTop: '36px' }}>
          <NextButton
            handleClick={onSaveChanges}
            disabled={isNotValidatedSaveChanges}
            buttonText="SAVE CHANGES"
          />
        </div>
      </Box>
    </Dialog>
  );
};

export default AmbulanceAssignmentPage;
