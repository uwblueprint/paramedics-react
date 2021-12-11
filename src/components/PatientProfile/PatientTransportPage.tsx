import React from 'react';
import { NavLink } from 'react-router-dom';
import { Typography, makeStyles, Button, Dialog, Box } from '@material-ui/core';
import HospitalTransportSelector from './HospitalTransportSelector';
import AmbulanceTransportSelector from './AmbulanceTransportSelector';
import { GET_ALL_HOSPITALS } from '../../graphql/queries/hospitals';
import { ADD_HOSPITALS_TO_EVENT, ADD_AMBULANCES_TO_EVENT } from '../../graphql/mutations/events';
import { ADD_HOSPITAL } from '../../graphql/mutations/hospitals';
import { ADD_AMBULANCE } from '../../graphql/mutations/ambulances';
import { useQuery, useMutation } from 'react-apollo';
import NextButton from '../EventCreation/NextButton';
import BackButton from '../common/BackButton';
import Stepper from '../EventCreation/Stepper';
import { Colours } from '../../styles/Constants';
import { Hospital } from '../../graphql/queries/hospitals';
import { Ambulance, GET_ALL_AMBULANCES } from '../../graphql/queries/ambulances';
import { CCP } from '../../graphql/queries/ccps';
import FormField from '../common/FormField';
import HospitalAssignmentPage from './HospitalAssignmentPage';
import { Event } from '../../graphql/queries/events';
import AmbulanceAssignmentPage from './AmbulanceAssignmentPage';

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
  handleHospitalChange: (e: any) => void;
  handleAmbulanceChange: (e: any) => void;
  handleRunNumber: (runNumber: string) => void;
  currEvent: Event;
}) => {
  const [runNumberField, setRunNumberField] = React.useState(runNumber);
  const [openHospitalAssignment, setOpenHospitalAssignment] = React.useState(
    false
  );
  const [openAmbulanceAssignment, setOpenAmbulanceAssignment] = React.useState(false)
  const [activeHospitals, setActiveHospitals] = React.useState<Hospital[]>([]);
  const [activeAmbulances, setActiveAmbulances] = React.useState<Ambulance[]>(
    []
  );
  const [addHospitalsToEvent] = useMutation(ADD_HOSPITALS_TO_EVENT);
  const [addAmbulancesToEvent] = useMutation(ADD_AMBULANCES_TO_EVENT);
  const [addHospital] = useMutation(ADD_HOSPITAL, {
    update(cache, { data: { addHospital } }) {
      cache.writeQuery({
        query: GET_ALL_HOSPITALS,
        data: { hospitals: hospitals.concat([addHospital]) },
      });
    },
    onCompleted({ addHospital: { id } }) {
        addHospitalsToEvent({
          variables: { eventId: currEvent.id, hospitals: [{id: Number(id)}] },
        });
        handleHospitalChange({ target: { value: id }});
    },
  });
  const [addAmbulance] = useMutation(ADD_AMBULANCE, {
    update(cache, { data: { addAmbulance } }) {
      cache.writeQuery({
        query: GET_ALL_AMBULANCES,
        data: { ambulances: ambulances.concat([addAmbulance]) },
      });
    },
    onCompleted({ addAmbulance: { id } }) {
      addAmbulancesToEvent({
        variables: { eventId: currEvent.id, ambulances: [{id: Number(id)}] },
      });
      handleAmbulanceChange({ target: { value: id }});
    },
  });
  const inactiveHospitals = hospitals.filter((hospital) => 
  !activeHospitals.find((activeHospital) => activeHospital.id === hospital.id)
  );
  const inactiveAmbulances = ambulances.filter((ambulance) => !activeAmbulances.find((activeAmbulance) => activeAmbulance.id === ambulance.id));
  const isValidToSaveChanges = selectedAmbulance.length !== 0 && selectedHospital.length !== 0;
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

  const handleHospitalAssignmentClose = () => setOpenHospitalAssignment(false);
  
  const handleHospitalAssignmentSubmit = (selectedHospitalId) => {
    addHospitalsToEvent({
      variables: { eventId: currEvent.id, hospitals: [{id: Number(selectedHospitalId)}] },
    });
    setOpenHospitalAssignment(false);
  };

  const handleAddingHospital = (hospitalName) => {
    addHospital({
      variables: {
        name: hospitalName
      }
    });
    setOpenHospitalAssignment(false);
  }
  

  const onRunNumberChange = (e: React.ChangeEvent<HTMLElement>) => {
    setRunNumberField((e.target as HTMLInputElement).value);
    handleRunNumber((e.target as HTMLInputElement).value);
  };

  const handleAmbulanceAssignmentClose = () => setOpenAmbulanceAssignment(false);

  const handleAmbulanceAssignmentSubmit = (selectedAmbulanceId) => {
    addAmbulancesToEvent({
      variables: { eventId: currEvent.id, ambulances: [{id: Number(selectedAmbulanceId)}] },
    });
    setOpenAmbulanceAssignment(false);
  };

  const handleAddingAmbulance = (ambulanceNumber) => {
    addAmbulance({
      variables: { vehicleNumber: Number(ambulanceNumber) }
    });
    setOpenAmbulanceAssignment(false);
  }

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <HospitalAssignmentPage
        hospitals={inactiveHospitals}
        open={openHospitalAssignment}
        handleClose={handleHospitalAssignmentClose}
        handleHospitalChange={handleHospitalChange}
        handleSubmit={handleHospitalAssignmentSubmit}
        handleAddHospital={handleAddingHospital}
      />
      <AmbulanceAssignmentPage
        open={openAmbulanceAssignment}
        handleClose={handleAmbulanceAssignmentClose}
        handleSubmit={handleAmbulanceAssignmentSubmit}
        ambulances={inactiveAmbulances}
        handleAmbulanceChange={handleAmbulanceChange}
        handleAddAmbulance={handleAddingAmbulance}
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
              setOpenAmbulanceAssignment={setOpenAmbulanceAssignment}
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
              disabled={!isValidToSaveChanges}
            />
          }
          backButton={<BackButton onClick={handleClose} />}
        />
      </Box>
    </Dialog>
  );
};

export default PatientTransportPage;
