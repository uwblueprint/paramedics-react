import React, { useState, useEffect } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { Box, Button, Typography, makeStyles } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import { useSnackbar } from 'notistack';
import ConfirmModal from '../common/ConfirmModal';
import { Colours } from '../../styles/Constants';
import FormField from '../common/FormField';
import LoadingState from '../common/LoadingState';
import CompletePatientButton from './CompletePatientButton';
import RadioSelector from '../common/RadioSelector';
import TriagePills from './TriagePills';
import StatusPills from './StatusPills';
import DeletePatientButton from './DeletePatientButton';
import PatientTransportPage from './PatientTransportPage';
import {
  TriageLevel,
  Status,
  Patient,
  Gender,
  GET_PATIENT_BY_ID,
  GET_ALL_PATIENTS,
} from '../../graphql/queries/patients';
import {
  ADD_PATIENT,
  EDIT_PATIENT,
  DELETE_PATIENT,
} from '../../graphql/mutations/patients';
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

const useStyles = makeStyles({
  patientCancelBtn: {
    minWidth: '228px',
    alignSelf: 'center',
    display: 'flex',
  },
});

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
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [openTransportModal, setOpenTransportModal] = useState(false);
  const [openTransportPage, setOpenTransportPage] = useState(false);
  const [transportConfirmed, setTransportConfirmed] = useState(false);
  const [transportingPatient, setTransportingPatient] = useState(false);
  const [deleteClicked, setDeleteClicked] = useState(false);
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
  const patients: Array<Patient> = data ? data.patients : [];
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
  const [deletePatient] = useMutation(DELETE_PATIENT, {
    onCompleted() {
      history.replace(`/events/${eventId}/ccps/${ccpId}`);
    },
  });
  const isRestore =
    !loading && mode === 'edit'
      ? data.patient.status === Status.DELETED
      : false;

  const [formFields, setFormFields] = useState<FormFields>({
    barcodeValue: mode === 'new' && !!barcodeValue ? barcodeValue : '',
    triage: TriageLevel.GREEN,
    gender: Gender.M,
    age: null,
    notes: '',
    status: Status.ON_SITE,
    runNumber: null,
  });

  const headerLabel =
    mode === 'new'
      ? 'Add a patient'
      : isRestore
      ? 'Restore patient'
      : 'Edit patient';

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

      const formStatus = status === Status.DELETED ? Status.ON_SITE : status;
      setFormFields(() => ({
        barcodeValue,
        triage: triageLevel,
        gender,
        age,
        notes,
        status: formStatus,
        runNumber,
      }));
      if (hospitalId) setSelectedHospital(hospitalId);
      if (ambulanceId) setSelectedAmbulance(ambulanceId);
      setTransportConfirmed(status === Status.TRANSPORTED);
    }
  }, [data, loading, mode]);

  const handleDeleteClick = () => {
    setDeleteClicked(true);
  };

  const handleDeleteCancel = () => {
    setDeleteClicked(false);
  };

  const handleDeleteConfirm = () => {
    if (mode === 'edit') {
      deletePatient({
        variables: {
          id: patientId,
        },
      });
    }
  };

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
    <Button
      onClick={() =>
        history.push(`/events/${eventId}/ccps/${ccpId}/open/${patientId}`)
      }
      style={{ color: Colours.SnackbarButtonBlue }}
    >
      View Patient Details
    </Button>
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
            : null,
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
      if (isRestore) {
        enqueueSnackbar(`Patient #${formFields.barcodeValue} restored.`);
      }

      editPatient({
        variables: {
          id: patientId,
          gender: formFields.gender,
          age: formFields.age ? parseInt(formFields.age.toString()) : -1,
          runNumber: formFields.runNumber
            ? parseInt(formFields.runNumber.toString())
            : null,
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

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Box>
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
      <Box
        display="flex"
        justifyContent="space-between"
        padding="56px 56px 36px 56px"
        borderBottom={`1px solid ${Colours.BorderLightGray}`}
      >
        <Typography variant="h4">{headerLabel}</Typography>
        <Button
          color="secondary"
          variant="outlined"
          className={classes.patientCancelBtn}
          component={NavLink}
          to={`/events/${eventId}/ccps/${ccpId}`}
        >
          Cancel
        </Button>
      </Box>
      <Box padding="56px">
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
              if (newStatus) {
                setFormFields({ ...formFields, status: newStatus });
              }
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
            validators={['minNumber:1', 'matchRegexp:^[0-9]*$', 'required']}
            errorMessages={[
              'Invalid age',
              'Invalid age',
              'This is a mandatory field',
            ]}
            numeric
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
            value={formFields.notes || ''}
            isValidated={false}
            isMultiline
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
          {mode === 'edit' && (
            <>
              {!isRestore && (
                <DeletePatientButton handleClick={handleDeleteClick} />
              )}
              <ConfirmModal
                open={deleteClicked}
                handleClickCancel={handleDeleteCancel}
                handleClickAction={handleDeleteConfirm}
                title="You are about to delete a patient"
                body="Deleting a patient will remove all records of the patient."
                actionLabel="Delete"
                isActionDelete
              />
            </>
          )}
        </ValidatorForm>
      </Box>
    </Box>
  );
};

export default PatientProfilePage;
