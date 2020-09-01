import React, { useState, useEffect } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import { useSnackbar } from 'notistack';
import ConfirmModal from '../common/ConfirmModal';
import { Colours } from '../../styles/Constants';
import FormField from '../common/FormField';
import CompletePatientButton from './CompletePatientButton';
import RadioSelector from '../common/RadioSelector';
import TriagePills from './TriagePills';
import StatusPills from './StatusPills';
import PatientTransportPage from './PatientTransportPage';
import {
  TriageLevel,
  Status,
  Patient,
  Gender,
  GET_PATIENT_BY_ID,
  GET_ALL_PATIENTS,
} from '../../graphql/queries/patients';
import { ADD_PATIENT, EDIT_PATIENT } from '../../graphql/mutations/patients';
import { Hospital, GET_ALL_HOSPITALS } from '../../graphql/queries/hospitals';
import {
  Ambulance,
  GET_ALL_AMBULANCES,
} from '../../graphql/queries/ambulances';
import { CCP, GET_CPP_BY_ID } from '../../graphql/queries/ccps';

interface FormFields {
  barcodeValue: string;
  triage: TriageLevel | null;
  gender: Gender;
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
  const { enqueueSnackbar } = useSnackbar();
  const [openTransportModal, setOpenTransportModal] = useState(false);
  const [openTransportPage, setOpenTransportPage] = useState(false);
  const [transportConfirmed, setTransportConfirmed] = useState(false);
  const [transportingPatient, setTransportingPatient] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital>({
    id: '',
    name: '',
  });
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance>({
    id: '',
    vehicleNumber: 0,
  });

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
  const { data: ccpData } = useQuery(GET_CPP_BY_ID(ccpId));
  const ccp: CCP = ccpData ? ccpData.collectionPoint : [];

  const [addPatient] = useMutation(ADD_PATIENT, {
    update(cache, { data: { addPatient } }) {
      cache.writeQuery({
        query: GET_ALL_PATIENTS,
        data: { patients: patients.concat([addPatient]) },
      });
    },
  });
  const [editPatient] = useMutation(EDIT_PATIENT);

  // We need the CCP passed in!
  const [formFields, setFormFields] = useState<FormFields>({
    barcodeValue: '',
    triage: TriageLevel.GREEN,
    gender: Gender.M,
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
        gender: Gender;
        age: number;
        notes: string;
        status: Status;
        runNumber: number | null;
        hospitalId: Hospital;
        ambulanceId: Ambulance;
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
      if (hospitalId) setSelectedHospital(hospitalId);
      if (ambulanceId) setSelectedAmbulance(ambulanceId);
      setTransportConfirmed(status === Status.TRANSPORTED);
    }
  }, [data, loading, mode]);

  useEffect(() => {
    if (mode === 'new' && barcodeValue) {
      setFormFields({ ...formFields, barcodeValue });
    }
  }, [mode, barcodeValue]);

  const handleCloseDialog = () => {
    setOpenTransportModal(false);
  };

  const handleCancelTransport = () => {
    setSelectedHospital({
      id: '',
      name: '',
    });
    setSelectedAmbulance({
      id: '',
      vehicleNumber: 0,
    });
    setOpenTransportModal(false);
    setOpenTransportPage(false);
  };

  const handleConfirmTransport = () => {
    setTransportConfirmed(true);
    setOpenTransportPage(false);
  };

  const handleHospitalChange = (e: React.ChangeEvent<HTMLElement>) => {
    setSelectedHospital({
      id: (e.target as HTMLInputElement).value,
      name: hospitals.filter(
        (hospital) => hospital.id === (e.target as HTMLInputElement).value
      )[0].name,
    });
  };

  const handleAmbulanceChange = (e: React.ChangeEvent<HTMLElement>) => {
    setSelectedAmbulance({
      id: (e.target as HTMLInputElement).value,
      vehicleNumber: ambulances.filter(
        (ambulance) => ambulance.id === (e.target as HTMLInputElement).value
      )[0].vehicleNumber,
    });
  };

  const action = () => (
    <>
      <Button style={{ color: Colours.SnackbarButtonBlue }}>
        View Patient Details
      </Button>
    </>
  );

  const handleComplete = () => {
    if (transportingPatient && !transportConfirmed) {
      setOpenTransportModal(true);
      return;
    }
    const transportTime =
      transportingPatient && transportConfirmed ? new Date() : null;
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
          transportTime,
          triageCategory: formFields.triageCategory,
          triageLevel: formFields.triage,
          notes: formFields.notes,
          hospitalId: selectedHospital.id !== '' ? selectedHospital.id : null,
          ambulanceId:
            selectedAmbulance.id !== '' ? selectedAmbulance.id : null,
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
          transportTime,
          triageCategory: formFields.triageCategory,
          triageLevel: formFields.triage,
          notes: formFields.notes,
          hospitalId: selectedHospital.id !== '' ? selectedHospital.id : null,
          ambulanceId:
            selectedAmbulance.id !== '' ? selectedAmbulance.id : null,
        },
      });
    }
    if (transportingPatient) {
      enqueueSnackbar(`Patient ${formFields.barcodeValue} transported.`, {
        action,
      });
    }
    history.replace(`/events/${eventId}/ccps/${ccpId}`);
  };

  return (
    <div className="landing-wrapper">
      <PatientTransportPage
        open={openTransportPage}
        patientBarcode={mode === 'edit' ? formFields.barcodeValue : null}
        ccp={ccp}
        handleClose={handleCancelTransport}
        handleComplete={handleConfirmTransport}
        hospitals={hospitals}
        ambulances={ambulances}
        selectedHospital={selectedHospital.id}
        selectedAmbulance={selectedAmbulance.id}
        handleHospitalChange={handleHospitalChange}
        handleAmbulanceChange={handleAmbulanceChange}
      />
      <ConfirmModal
        open={openTransportModal}
        isDeleteConfirmation={false}
        title="You are about to transport a patient to a hospital"
        body={
          <>
            Transporting a patient will:
            <ul>
              <li>
                Move a patient on scene to a selected hospital and ambulance.
              </li>
              <li>
                All transported patients can be found in the hospital tab.
              </li>
              <li>
                A run number needs to be manually added to transported patients.
              </li>
            </ul>
          </>
        }
        actionLabel="Continue to transport"
        handleClickAction={() => {
          setOpenTransportPage(true);
          setOpenTransportModal(false);
        }}
        handleClickCancel={handleCloseDialog}
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
              component={NavLink}
              to={`/events/${eventId}/ccps/${ccpId}`}
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
          <Typography variant="h5" style={{ marginBottom: '24px' }}>
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
            labels={Object.keys(Gender)}
            currentValue={formFields.gender}
            handleChange={(e: React.ChangeEvent<HTMLElement>) => {
              setFormFields({
                ...formFields,
                gender: (e.target as HTMLInputElement).value as Gender,
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
                style={{ marginBottom: '24px', marginTop: '30px' }}
              >
                Transport Information
              </Typography>
              <FormField
                label="Hospital:"
                value={selectedHospital.name}
                readOnly
                isValidated={false}
              />
              <FormField
                label="Ambulance Number:"
                value={selectedAmbulance.vehicleNumber.toString()}
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
