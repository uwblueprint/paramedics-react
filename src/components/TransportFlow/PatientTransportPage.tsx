import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import '../styles/ResourceCreationPage.css';
import Typography from '@material-ui/core/Typography';
import FormField from '../components/common/FormField';
import BackLink from '../components/ResourceFormPage/BackLink';
import CancelButton from '../components/ResourceFormPage/CancelButton';
import DoneButton from '../components/ResourceFormPage/DoneButton';
import AccessLevelSelector from '../components/ResourceFormPage/AccessLevelSelector';
import { Colours } from '../styles/Constants';
import Button from '@material-ui/core/Button';
import FormField from '../components/common/FormField';
import {
  Patient,
  GET_PATIENT_BY_ID,
  GET_ALL_PATIENTS,
} from '../graphql/queries/patients';
import { ADD_PATIENT, EDIT_PATIENT } from '../graphql/mutations/patients';
import { GET_ALL_HOSPITALS } from '../../graphql/queries/hospitals';


const PatientTransportPage = ({
  match: {
    params: { mode, ccpId, patientId },
  },
}: {
  match: { params: { mode: string; patientId?: string; ccpId: string } };
}) => {
  const history = useHistory();

  const { data, loading } = useQuery(GET_PATIENT_BY_ID(patientId));
  const patients: Array<Patient> = data ? data.patient : [];
  const [editPatient] = useMutation(EDIT_PATIENT);

  useEffect(() => {

  }, [data]);



  const handleComplete = () => {
    editPatient({
      variables: {
        id: patientId,
        status,
        transportTime: new Date(),
        hospitalId
      },
    });
    history.replace('/manage');
  };

  return (
    <div className="resource-add-wrapper">
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
              Choose a hospital and an ambulance from the list below to transport patient {barcode} to.
            </Typography>
          </div>
        ) : (
            ''
          )}
      </div>
      <div className="event-form">
        <FormField
          label="Team Member Name:"
          required
          isValidated={false}
          onChange={handleNameChange}
          value={memberName}
        />
        <FormField
          label="Email:"
          required
          isValidated
          validators={['required', 'isEmail']}
          errorMessages={['This is a mandatory field', 'Invalid email']}
          onChange={handleEmailChange}
          value={email}
        />
        <AccessLevelSelector
          currentValue={role}
          handleChange={handleRoleChange}
        />
        <div className="caption">
          <Typography
            variant="caption"
            style={{ color: Colours.SecondaryGray }}
          >
            *Denotes a required field
            </Typography>
        </div>
      </div>
      <div className="done-container">
        <DoneButton
          handleClick={handleComplete}
          disabled={memberName === '' || email === ''}
        />
      </div>
      <div className="cancel-container">
        <CancelButton to="/manage" />
      </div>
    </div>
  );
};

export default PatientTransportPage;