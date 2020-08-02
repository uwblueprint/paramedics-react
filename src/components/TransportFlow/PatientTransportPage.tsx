import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import { Typography, makeStyles, Button } from '@material-ui/core';
import HospitalTransportSelector from './HospitalTransportSelector';
import AmbulanceTransportSelector from './AmbulanceTransportSelector';
import BackLink from '../common/BackLink';
import CancelButton from '../common/CancelButton';
import { Colours } from '../../styles/Constants';
import {
  Status,
  Patient,
  GET_PATIENT_BY_ID,
} from '../../graphql/queries/patients';
import { EDIT_PATIENT } from '../../graphql/mutations/patients';
import { Hospital, GET_ALL_HOSPITALS } from '../../graphql/queries/hospitals';
import { Ambulance, GET_ALL_AMBULANCES } from '../../graphql/queries/ambulances'

const useStyles = makeStyles({
  resourceWrapper: {
    backgroundColor: 'white',
  },
  resourceCreationTopSection: {
    margin: '48px 30px 0px 30px',
    backgroundColor: 'white',
    borderBottom: '1px solid #c4c4c4',
  },
  resourceHeader: {
    display: 'flex',
    padding: '16px 0px',
  },
  resourceForm: {
    padding: '30px',
  },
  caption: {
    marginBottom: '16px',
  },
  confirmButton: {
    minWidth: '160px',
    minHeight: '40px',
    fontSize: '18px',
    margin: '10px 0px',
    position: 'absolute',
    right: '56px',
  },
  cancelButton: {
    minWidth: '160px',
    minHeight: '40px',
    fontSize: '18px',
    marginTop: '50px',
    position: 'absolute',
    right: '56px',
  },
});

const PatientTransportPage = ({
  match: {
    params: { eventId, ccpId, patientId },
  },
}: {
  match: { params: { eventId: string; patientId: string; ccpId: string } };
}) => {
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedAmbulance, setSelectedAmbulance] = useState("");

  const history = useHistory();

  const { data: patientData } = useQuery(GET_PATIENT_BY_ID(patientId));
  const patient: Patient = patientData ? patientData.patient : {};

  const { data: hospitalData } = useQuery(GET_ALL_HOSPITALS);
  const hospitals: Array<Hospital> = hospitalData ? hospitalData.hospitals : [];

  const { data: ambulanceData } = useQuery(GET_ALL_AMBULANCES);
  const ambulances: Array<Ambulance> = ambulanceData ? ambulanceData.ambulances : [];

  const [editPatient] = useMutation(EDIT_PATIENT);

  const handleHospitalChange = (e: any) => {
    setSelectedHospital(e.target.value);
  };

  const handleAmbulanceChange = (e: any) => {
    setSelectedAmbulance(e.target.value);
  };

  const handleComplete = () => {
    editPatient({
      variables: {
        id: patientId,
        status: Status.TRANSPORTED,
        transportTime: new Date(),
        collectionPointId: ccpId,
        hospitalId: selectedHospital,
        ambulanceId: selectedAmbulance
      },
    });
    history.replace(`/events/${eventId}/ccps/${ccpId}`);
  };

  const classes = useStyles();

  return (
    <div className={classes.resourceWrapper}>
      <Button
        href={`/events/${eventId}/ccps/${ccpId}`}
        color="secondary"
        className={classes.cancelButton}
      >
        Cancel
        </Button>
      <div className={classes.resourceCreationTopSection}>
        <BackLink to="/events/${eventId}/ccps/${ccpId}" />
        <div className={classes.resourceHeader}>
          <Typography variant="h4">
            Patient Transport
          </Typography>
        </div>
        <div className={classes.caption}>
          <Typography
            variant="caption"
            style={{ color: Colours.SecondaryGray }}
          >
            Choose a hospital and an ambulance from the list below to transport patient {patient.barcodeValue} to.
            </Typography>
        </div>
      </div>
      <div className={classes.resourceForm}>
        <HospitalTransportSelector
          options={hospitals}
          currentValue={selectedHospital}
          handleChange={handleHospitalChange}
        />
        {/* <Link href="/manage/hospitals/new/patientId" variant="body2" color="secondary" underline="always">Hospital not listed? Add a new hospital</Link> */}
        <AmbulanceTransportSelector
          options={ambulances}
          currentValue={selectedAmbulance}
          handleChange={handleAmbulanceChange}
        />
        {/* <Link href="/manage/ambulances/new/patientId" variant="body2" color="secondary" underline="always">Ambulance not listed? Add a new ambulance</Link> */}
      </div>
      <Button
        className={classes.confirmButton}
        onClick={handleComplete}
        color="secondary"
        variant="contained"
        disabled={selectedAmbulance === '' || selectedHospital === ''}
      >
        Confirm Transport
            </Button>
    </div >
  );
};

export default PatientTransportPage;