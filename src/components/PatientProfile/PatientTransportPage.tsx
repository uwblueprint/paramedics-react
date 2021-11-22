import React from 'react';
import { NavLink } from 'react-router-dom';
import { Typography, makeStyles, Button, Dialog, Box } from '@material-ui/core';
import HospitalTransportSelector from './HospitalTransportSelector';
import AmbulanceTransportSelector from './AmbulanceTransportSelector';
import { GET_HOSPITAL_BY_ID } from '../../graphql/queries/hospitals';
import { useQuery } from 'react-apollo';
import NextButton from '../EventCreation/NextButton';
import BackButton from '../common/BackButton';
import Stepper from '../EventCreation/Stepper';
import { Colours } from '../../styles/Constants';
import { Hospital } from '../../graphql/queries/hospitals';
import { Ambulance } from '../../graphql/queries/ambulances';
import { CCP } from '../../graphql/queries/ccps';
import FormField from '../common/FormField';
import HospitalAssignmentPage from './HospitalAssignmentPage';
import { Event } from '../../graphql/queries/events';

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

const PatientTransportPage = ({
  open,
  runNumber,
  ccp,
  handleClose,
  handleComplete,
  hospitals,
  ambulances,
  selectedHospital,
  selectedAmbulance,
  handleAddHospital,
  handleAddAmbulance,
  handleHospitalChange,
  handleAmbulanceChange,
  handleRunNumber,
  currEvent,
}: {
  open: boolean;
  runNumber: string | null;
  ccp: CCP;
  handleClose: () => void;
  handleComplete: () => void;
  hospitals: Array<Hospital>;
  ambulances: Array<Ambulance>;
  selectedHospital: string;
  selectedAmbulance: string;
  handleAddHospital: (id: string) => void;
  handleAddAmbulance: (id: string) => void;
  handleHospitalChange: (e: React.ChangeEvent<HTMLElement>) => void;
  handleAmbulanceChange: (e: React.ChangeEvent<HTMLElement>) => void;
  handleRunNumber: (runNumber: string) => void;
  currEvent: Event;
}) => {
  const [runNumberField, setRunNumberField] = React.useState(runNumber);
  const [openHospitalAssignment, setOpenHospitalAssignment] = React.useState(
    false
  );
  const [activeHospitals, setActiveHospitals] = React.useState<Hospital[]>([]);
  const [activeAmbulances, setActiveAmbulances] = React.useState<Ambulance[]>(
    []
  );    
  const { data } = useQuery(GET_HOSPITAL_BY_ID(selectedHospital));

  console.log({ data });

  const classes = useStyles();

  React.useEffect(() => {
    const activeHospitals = hospitals.filter((hospital) => {
      if (currEvent) {
        const { hospitals } = currEvent;
        const hospitalFound = hospitals.find(
          (hospitalEvent) => hospital.id === hospitalEvent.id
        );

        return hospitalFound !== undefined;
      }
      return false;
    });

    const activeAmbulances = ambulances.filter((ambulance) => {
      if (currEvent) {
        const { ambulances } = currEvent;
        const ambulanceFound = ambulances.find(
          (ambulanceEvent) => ambulance.id === ambulanceEvent.id
        );

        return ambulanceFound !== undefined;
      }
      return false;
    });

    setActiveHospitals(activeHospitals);
    setActiveAmbulances(activeAmbulances);

    setRunNumberField(runNumber);
  }, [runNumber, hospitals, ambulances, currEvent]);

  const handleAssignmentClose = () => {
    setOpenHospitalAssignment(false);
  };
  
  // 1. Set hospital to active
  // 2. Update the list of hospitals
  const handleAssignmentSubmit = (selectedHospital) => {
    handleAddHospital(selectedHospital);
  };
  

  const onRunNumberChange = (e: React.ChangeEvent<HTMLElement>) => {
    setRunNumberField((e.target as HTMLInputElement).value);
    handleRunNumber((e.target as HTMLInputElement).value);
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <HospitalAssignmentPage
        hospitals={hospitals}
        open={openHospitalAssignment}
        handleClose={handleAssignmentClose}
        handleHospitalChange={handleHospitalChange}
        handleSubmit={handleAssignmentSubmit}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        padding="56px 56px 36px 56px"
        borderBottom={`1px solid ${Colours.BorderLightGray}`}
      >
        <Typography variant="h4">Edit patient</Typography>
        <Button
          color="secondary"
          variant="outlined"
          className={classes.cancelButton}
          component={NavLink}
          to={`/events/${ccp.eventId.id}/ccps/${ccp.id}`}
        >
          Cancel
        </Button>
      </Box>
      <Box padding="56px">
        <Typography variant="h4" style={{ marginBottom: '24px' }}>
          Transport Information
        </Typography>
        <div className={classes.resourceWrapper}>
          <div className={classes.resourceForm}>
            <HospitalTransportSelector
              options={activeHospitals}
              currentValue={selectedHospital}
              handleChange={handleHospitalChange}
              setOpenHospitalAssignment={setOpenHospitalAssignment}
            />
            <AmbulanceTransportSelector
              options={activeAmbulances}
              currentValue={selectedAmbulance}
              handleChange={handleAmbulanceChange}
            />
          </div>
          <FormField
            label="Run Number:"
            placeholder="Enter run number"
            isValidated={false}
            onChange={onRunNumberChange}
            value={runNumberField || ''}
          />
        </div>
        <div className={classes.caption}>
          <Typography variant="caption" color="textSecondary">
            *Denotes a required field.
          </Typography>
        </div>

        <Stepper
          activeStep={1}
          nextButton={
            <NextButton
              buttonText="Save Changes"
              handleClick={handleComplete}
              disabled={false}
            />
          }
          backButton={<BackButton onClick={handleClose} />}
        />
      </Box>
    </Dialog>
  );
};

export default PatientTransportPage;
