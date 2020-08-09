import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/EventCreationPage.css';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import FormField from '../common/FormField';
import CompletePatientButton from './CompletePatientButton';
import RadioSelector from '../common/RadioSelector';
import TriagePills from './TriagePills';
import StatusPills from './StatusPills';
import PatientTransportDialog from './PatientTransportDialog';
import PatientTransportPage from './PatientTransportPage';
import {
  TriageLevel,
  Status,
  Patient,
  GET_PATIENT_BY_ID,
  GET_ALL_PATIENTS,
} from '../../graphql/queries/patients';
import { ADD_PATIENT, EDIT_PATIENT } from '../../graphql/mutations/patients';
import { Hospital, GET_ALL_HOSPITALS } from '../../graphql/queries/hospitals';
import {
  Ambulance,
  GET_ALL_AMBULANCES,
} from '../../graphql/queries/ambulances';

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
    params: { eventId, ccpId, patientId, barcodeValue },
  },
  mode,
}: {
  match: {
    params: {
      eventId: string;
      patientId?: string;
      ccpId: string;
      barcodeValue?: string;
    };
  };
  mode: string;
}) => {
  const history = useHistory();

  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedAmbulance, setSelectedAmbulance] = useState('');
  const [openTransportModal, setOpenTransportModal] = useState(false);
  const [openTransportPage, setOpenTransportPage] = useState(false);
  const [transportConfirmed, setTransportConfirmed] = useState(false);
  const [transportingPatient, setTransportingPatient] = useState(false);

  const { data, loading } = useQuery(
    mode === 'edit' && patientId
      ? GET_PATIENT_BY_ID(patientId)
      : GET_ALL_PATIENTS
  );
  const patients: Array<Patient> = data ? data.patient : [];
  const { data: hospitalData } = useQuery(GET_ALL_HOSPITALS);
  const hospitals: Array<Hospital> = hospitalData ? hospitalData.hospitals : [];

  const { data: ambulanceData } = useQuery(GET_ALL_AMBULANCES);
  const ambulances: Array<Ambulance> = ambulanceData
    ? ambulanceData.ambulances
    : [];

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
        hospitalId,
        ambulanceId,
      }: {
        barcodeValue: string;
        triageLevel: TriageLevel;
        gender: string;
        age: number;
        notes: string;
        status: Status;
        runNumber: number | null;
        hospitalId: string;
        ambulanceId: string;
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
      setSelectedHospital(hospitalId);
      setSelectedAmbulance(ambulanceId);
      setTransportConfirmed(status === Status.TRANSPORTED);
    }
  }, [data, loading, mode]);

  useEffect(() => {
    if (mode === 'new' && barcodeValue) {
      setFormFields({ ...formFields, barcodeValue });
    }
  }, [mode, barcodeValue]);

  const [addPatient] = useMutation(ADD_PATIENT, {
    update(cache, { data: { addPatient } }) {
      cache.writeQuery({
        query: GET_ALL_PATIENTS,
        data: { patients: patients.concat([addPatient]) },
      });
    },
  });
  const [editPatient] = useMutation(EDIT_PATIENT);

  const handleCloseDialog = () => {
    setOpenTransportModal(false);
  };

  const handleCancelTransport = () => {
    setSelectedHospital('');
    setSelectedAmbulance('');
    setOpenTransportModal(false);
    setOpenTransportPage(false);
  };

  const handleConfirmTransport = () => {
    setTransportConfirmed(true);
    setOpenTransportModal(false);
    setOpenTransportPage(false);
  };

  const handleHospitalChange = (e: React.ChangeEvent<HTMLElement>) => {
    setSelectedHospital((e.target as HTMLInputElement).value);
  };

  const handleAmbulanceChange = (e: React.ChangeEvent<HTMLElement>) => {
    setSelectedAmbulance((e.target as HTMLInputElement).value);
  };

  const handleComplete = () => {
    if (transportingPatient && !transportConfirmed) {
      setOpenTransportModal(true);
      return;
    }
    if (mode === 'new') {
      addPatient({
        variables: {
          gender: formFields.gender,
          age: formFields.age ? parseInt(formFields.age.toString()) : -1,
          runNumber: formFields.runNumber
            ? parseInt(formFields.runNumber.toString())
            : -1,
          barcodeValue: formFields.barcodeValue
            ? formFields.barcodeValue.toString()
            : '',
          collectionPointId: ccpId,
          status: formFields.status,
          triageCategory: formFields.triageCategory,
          triageLevel: formFields.triage,
          notes: formFields.notes,
          hospitalId: selectedHospital !== '' ? selectedHospital : null,
          ambulanceId: selectedAmbulance !== '' ? selectedAmbulance : null,
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
            ? formFields.barcodeValue.toString()
            : '',
          collectionPointId: ccpId,
          status: formFields.status,
          triageCategory: formFields.triageCategory,
          triageLevel: formFields.triage,
          notes: formFields.notes,
          hospitalId: selectedHospital !== '' ? selectedHospital : null,
          ambulanceId: selectedAmbulance !== '' ? selectedAmbulance : null,
        },
      });
    }
    history.replace(`/events/${eventId}/ccps/${ccpId}`);
  };

  return (
    <div className="landing-wrapper">
      <PatientTransportPage
        open={openTransportPage}
        // patient={mode === 'edit' ? data.patient : null}
        handleClose={handleCancelTransport}
        handleComplete={handleConfirmTransport}
        hospitals={hospitals}
        ambulances={ambulances}
        selectedHospital={selectedHospital}
        selectedAmbulance={selectedAmbulance}
        handleHospitalChange={handleHospitalChange}
        handleAmbulanceChange={handleAmbulanceChange}
      />
      <PatientTransportDialog
        open={openTransportModal}
        handleClose={handleCloseDialog}
        handleComplete={() => setOpenTransportPage(true)}
      />
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
          <Typography variant="h5" style={{ marginBottom: 24 }}>
            Patient Information
          </Typography>
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
              setTransportingPatient(newStatus === Status.TRANSPORTED);
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
            labels={['Male', 'Female']}
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
          {transportConfirmed === true && (
            <>
              <Typography
                variant="h5"
                style={{ marginBottom: 24, marginTop: 30 }}
              >
                Transport Information
              </Typography>
              <FormField
                label="Hospital:"
                value={selectedHospital} // there's probably a better way to do this
                readOnly
                isValidated={false}
              />
              <FormField
                label="Ambulance Number:"
                value={selectedAmbulance} // there's probably a better way to do this
                readOnly
                isValidated={false}
              />
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
            </>
          )}
          <CompletePatientButton />
        </ValidatorForm>
      </div>
    </div>
  );
};

export default PatientProfilePage;
