import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
// import '../styles/ResourceCreationPage.css';
import { Typography, Link, FormControl, Button } from '@material-ui/core';
import HospitalTransportSelector from './HospitalTransportSelector';
import AmbulanceTransportSelector from './AmbulanceTransportSelector';
import BackLink from '../common/BackLink';
import CancelButton from '../common/CancelButton';
import { Colours } from '../../styles/Constants';
import {
  Patient,
  GET_PATIENT_BY_ID,
} from '../../graphql/queries/patients';
import { EDIT_PATIENT } from '../../graphql/mutations/patients';
import { Hospital, GET_ALL_HOSPITALS } from '../../graphql/queries/hospitals';
import { Ambulance, GET_ALL_AMBULANCES } from '../../graphql/queries/ambulances'


const PatientTransportPage = ({
  match: {
    params: { mode, ccpId, patientId },
  },
}: {
  match: { params: { mode: string; patientId: string; ccpId: string } };
}) => {
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedAmbulance, setSelectedAmbulance] = useState("");
  const [error, setError] = React.useState(false);

  const history = useHistory();

  const { data: patientData } = useQuery(GET_PATIENT_BY_ID(patientId));
  const patient: Patient = patientData ? patientData.patient : {};

  const { data: hospitalData } = useQuery(GET_ALL_HOSPITALS);
  const hospitals: Array<Hospital> = hospitalData ? hospitalData.hospitals : [];

  const { data: ambulanceData } = useQuery(GET_ALL_AMBULANCES);
  const ambulances: Array<Ambulance> = ambulanceData ? ambulanceData.ambulances : [];


  const [editPatient] = useMutation(EDIT_PATIENT);

  // useEffect(() => {
  // }, [patientData, hospitalData, ambulanceData]);

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
        status,
        transportTime: new Date(),
        hospitalId: selectedHospital
      },
    });
    history.replace('/manage');
  };

  return (
    <div className="resource-add-wrapper">
      <div className="user-icon">
        <CancelButton to="/manage" />
      </div>
      <div className="resource-creation-top-section">
        <BackLink to="/manage" />
        <div className="resource-header">
          <Typography variant="h4">
            Patient Transport
          </Typography>
        </div>
        {mode === 'new' ? (
          <div className="top-bar-link">
            <Typography
              variant="caption"
              style={{ color: Colours.SecondaryGray }}
            >
              Choose a hospital and an ambulance from the list below to transport patient {patient.barcodeValue} to.
            </Typography>
          </div>
        ) : (
            ''
          )}
      </div>
      <div className="event-form">
        <HospitalTransportSelector
          options={hospitals}
          currentValue={selectedHospital}
          handleChange={handleHospitalChange}
        />
        <Link href="/manage/hospitals/new" variant="body2" color="secondary" underline="always">Hospital not listed? Add a new hospital</Link>
        <AmbulanceTransportSelector
          options={ambulances}
          currentValue={selectedAmbulance}
          handleChange={handleAmbulanceChange}
        />
        <Link href="/manage/ambulances/new" variant="body2" color="secondary" underline="always">Ambulance not listed? Add a new ambulance</Link>
      </div>
      <div className="done-container">
        <Button
          onClick={handleComplete}
          disabled={selectedAmbulance === '' || selectedHospital === ''}
        >
          Confirm Transport
            </Button>
      </div>
    </div>
  );
};

export default PatientTransportPage;