import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/EventCreationPage.css';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import FormField from '../components/common/FormField';
import CompletePatientButton from '../components/PatientCreation/CompletePatientButton';
import RadioSelector from '../components/common/RadioSelector';
import TriagePills from '../components/PatientCreation/TriagePills';
import StatusPills from '../components/PatientCreation/StatusPills';
import {
  TriageLevel,
  Status,
  Patient,
  GET_PATIENT_BY_ID,
  GET_ALL_PATIENTS,
} from '../graphql/queries/patients';
import { ADD_PATIENT, EDIT_PATIENT } from '../graphql/mutations/patients';

interface FormFields {
  barcodeValue: string;
  triage: TriageLevel | null;
  gender: string;
  age: number | null;
  notes: string;
  runNumber?: number | null;
  collectionPointId?: number;
  status: Status | null;
  triageCategory?: number | null;
  TriageLevel?: number | null;
}

const PatientProfilePage = ({
  match: {
    params: { ccpId, patientId, barcodeValue },
  },
  mode,
}: {
  match: {
    params: {
      patientId?: string;
      ccpId: string;
      barcodeValue?: string;
    };
  };
  mode: string;
}) => {
  const history = useHistory();

  const { data, loading } = useQuery(
    mode === 'edit' && patientId
      ? GET_PATIENT_BY_ID(patientId)
      : GET_ALL_PATIENTS
  );
  const patients: Array<Patient> = data ? data.patient : [];

  // We need the CCP passed in!
  const [formFields, setFormFields] = useState<FormFields>({
    barcodeValue: '',
    triage: TriageLevel.GREEN,
    gender: 'Male',
    age: null,
    notes: '',
    status: Status.ON_SITE,
    runNumber: null,
  });
  useEffect(() => {
    if (!loading && mode === 'edit') {
      const {
        barcodeValue,
        triageLevel,
        gender,
        age,
        notes,
        status,
        runNumber,
      }: {
        barcodeValue: string;
        triageLevel: TriageLevel;
        gender: string;
        age: number;
        notes: string;
        status: Status;
        runNumber: number | null;
      } = data.patient;
      setFormFields({
        ...formFields,
        barcodeValue,
        triage: triageLevel,
        gender,
        age,
        notes,
        status,
        runNumber,
      });
    }
  }, [data]);
  useEffect(() => {
    if (mode === 'new' && barcodeValue) {
      setFormFields({ ...formFields, barcodeValue });
    }
  }, []);

  const [addPatient] = useMutation(ADD_PATIENT, {
    update(cache, { data: { newPatient } }) {
      cache.writeQuery({
        query: GET_ALL_PATIENTS,
        data: { patients: patients.concat([newPatient]) },
      });
    },
  });
  const [editPatient] = useMutation(EDIT_PATIENT);

  const handleComplete = () => {
    if (mode === 'new') {
      addPatient({
        variables: {
          gender: formFields.gender,
          age: formFields.age ? parseInt(formFields.age.toString()) : -1,
          runNumber: formFields.runNumber,
          barcodeValue: formFields.barcodeValue
            ? parseInt(formFields.barcodeValue.toString())
            : -1,
          collectionPointId: ccpId,
          status: formFields.status,
          triageCategory: formFields.triageCategory,
          triageLevel: formFields.triage,
          notes: formFields.notes,
        },
      });
    } else if (mode === 'edit') {
      editPatient({
        variables: {
          id: patientId,
          gender: formFields.gender,
          age: formFields.age ? parseInt(formFields.age.toString()) : -1,
          runNumber: formFields.runNumber
            ? parseInt(formFields.runNumber.toString())
            : -1,
          barcodeValue: formFields.barcodeValue
            ? parseInt(formFields.barcodeValue.toString())
            : -1,
          collectionPointId: ccpId,
          status: formFields.status,
          triageCategory: formFields.triageCategory,
          triageLevel: formFields.triage,
          notes: formFields.notes,
        },
      });
    }
    history.replace('/');
  };

  return (
    <div className="landing-wrapper">
      <div className="event-creation-top-section">
        <div className="landing-top-bar">
          <Typography variant="h3">
            {mode === 'new' ? 'Add a patient' : 'Edit patient'}
          </Typography>
          <div className="user-icon">
            <Button
              variant="outlined"
              color="secondary"
              style={{
                minWidth: '18rem',
                minHeight: '2.5rem',
                fontSize: '18px',
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <div className="event-form">
        <ValidatorForm onSubmit={handleComplete}>
          <FormField
            label="Barcode:"
            placeholder="Enter barcode"
            onChange={(e: React.ChangeEvent<HTMLElement>) => {
              setFormFields({
                ...formFields,
                barcodeValue: (e.target as HTMLInputElement).value,
              });
            }}
            value={formFields.barcodeValue}
            isValidated
            validators={['required']}
            errorMessages={['This is a mandatory field']}
          />
          <StatusPills
            currentStatus={formFields.status}
            handleChange={(
              e: React.MouseEvent<HTMLElement>,
              newStatus: Status
            ) => {
              setFormFields({ ...formFields, status: newStatus });
            }}
          />
          {mode === 'edit' && (
            <FormField
              label="Run Number:"
              placeholder="Enter run number"
              onChange={(e: React.ChangeEvent<HTMLElement>) => {
                setFormFields({
                  ...formFields,
                  runNumber: parseInt((e.target as HTMLInputElement).value),
                });
              }}
              value={
                formFields.runNumber ? formFields.runNumber.toString() : ''
              }
              isValidated={false}
            />
          )}
          <TriagePills
            currentStatus={formFields.triage}
            handleChange={(
              e: React.MouseEvent<HTMLElement>,
              newTriage: TriageLevel
            ) => {
              if (newTriage !== null) {
                setFormFields({ ...formFields, triage: newTriage });
              }
            }}
          />
          <RadioSelector
            labels={['M', 'F']}
            currentValue={formFields.gender}
            handleChange={(e: React.ChangeEvent<HTMLElement>) => {
              setFormFields({
                ...formFields,
                gender: (e.target as HTMLInputElement).value,
              });
            }}
          />
          <FormField
            label="Age:"
            placeholder="Enter age"
            onChange={(e: React.ChangeEvent<HTMLElement>) => {
              setFormFields({
                ...formFields,
                age: parseInt((e.target as HTMLInputElement).value),
              });
            }}
            value={formFields.age ? formFields.age.toString() : ''}
            isValidated
            validators={['minNumber:1', 'matchRegexp:^[0-9]*$']}
            errorMessages={['Invalid age']}
          />
          <FormField
            label="Notes:"
            placeholder="Additional details about the patient (eg. wounds, clothes ...)"
            onChange={(e: React.ChangeEvent<HTMLElement>) => {
              setFormFields({
                ...formFields,
                notes: (e.target as HTMLInputElement).value,
              });
            }}
            value={formFields.notes}
            isValidated={false}
          />
          <CompletePatientButton />
        </ValidatorForm>
      </div>
    </div>
  );
};

export default PatientProfilePage;
