import React, { useState, useEffect } from "react";
import "../styles/EventCreationPage.css";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormField from "../components/common/FormField";
import CompletePatientButton from "../components/PatientCreationPage/CompletePatientButton";
import RadioSelector from "../components/common/RadioSelector";
import TriagePills from "../components/PatientCreationPage/TriagePills";
import StatusPills from "../components/PatientCreationPage/StatusPills";
import { useMutation } from "@apollo/react-hooks";
import { useQuery } from "react-apollo";
import {
  triageLevel,
  status,
  PatientType,
  GET_PATIENT_BY_ID,
  GET_ALL_PATIENTS,
} from "../graphql/queries/templates/patients";
import {
  ADD_PATIENT,
  EDIT_PATIENT,
} from "../graphql/mutations/templates/patients";

interface FormFields {
  barcodeValue: string;
  triage: triageLevel | null;
  gender: string;
  age: number | null;
  notes: string;
  runNumber?: number | null;
  collectionPointId?: number;
  status: status | null;
  triageCategory?: number | null;
  triageLevel?: number | null;
  transportTime?: number | null;
}

const PatientProfilePage = ({
  match: {
    params: { mode, ccpId, patientId },
  },
}: {
  match: { params: { mode: string; patientId?: string; ccpId: string } };
}) => {
  const { data, loading, error } = useQuery(
    mode === "edit" && patientId
      ? GET_PATIENT_BY_ID(patientId)
      : GET_ALL_PATIENTS
  );
  const patients: Array<PatientType> = data ? data.patient : [];

  // We need the CCP passed in!
  const [formFields, setFormFields] = useState<FormFields>({
    barcodeValue: "",
    triage: null,
    gender: "Male",
    age: null,
    notes: "",
    status: status.ON_SITE,
    runNumber: null,
  });

  useEffect(() => {
    if (!loading && mode === "edit") {
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
        triageLevel: triageLevel;
        gender: string;
        age: number;
        notes: string;
        status: status;
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

  const [addPatient] = useMutation(ADD_PATIENT, {
    update(cache, { data: { addPatient } }) {
      cache.writeQuery({
        query: GET_ALL_PATIENTS,
        data: { patients: patients.concat([addPatient]) },
      });
    },
  });
  const [editPatient] = useMutation(EDIT_PATIENT);

  const handleComplete = () => {
    if (mode === "new") {
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
          transportTime: new Date(),
        },
      });
    } else if (mode === "edit") {
      editPatient({
        variables: {
          id: patientId,
          gender: formFields.gender,
          age: formFields.age ? parseInt(formFields.age.toString(), 10) : -1,
          runNumber: formFields.runNumber
            ? parseInt(formFields.runNumber.toString(), 10)
            : -1,
          barcodeValue: formFields.barcodeValue
            ? parseInt(formFields.barcodeValue.toString(), 10)
            : -1,
          collectionPointId: ccpId,
          status: formFields.status,
          triageCategory: formFields.triageCategory,
          triageLevel: formFields.triage,
          notes: formFields.notes,
          transportTime: new Date(),
        },
      });
    }
  };

  return (
    <div className="landing-wrapper">
      <div className="event-creation-top-section">
        <div className="landing-top-bar">
          <Typography variant="h3">
            {mode === "new" ? "Add a patient" : "Edit patient"}
          </Typography>
          <div className="user-icon">
            <Button
              variant="outlined"
              color="secondary"
              style={{
                minWidth: "18rem",
                minHeight: "2.5rem",
                fontSize: "18px",
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <div className="event-form">
        <form>
          <FormField
            label="Barcode:"
            placeholder="Enter barcode"
            onChange={(e: any) => {
              setFormFields({ ...formFields, barcodeValue: e.target.value });
            }}
            value={formFields.barcodeValue}
          />
          <StatusPills
            currentStatus={formFields.status}
            handleChange={(
              e: React.MouseEvent<HTMLElement>,
              newStatus: status
            ) => {
              setFormFields({ ...formFields, status: newStatus });
            }}
          />
          {mode === "edit" && (
            <FormField
              label="Run Number:"
              placeholder="Enter run number"
              onChange={(e: any) => {
                setFormFields({ ...formFields, runNumber: e.target.value });
              }}
              value={
                formFields.runNumber ? formFields.runNumber.toString() : ""
              }
            />
          )}
          <TriagePills
            currentStatus={formFields.triage}
            handleChange={(
              e: React.MouseEvent<HTMLElement>,
              newTriage: triageLevel
            ) => {
              setFormFields({ ...formFields, triage: newTriage });
            }}
          />
          <RadioSelector
            labels={["Male", "Female"]}
            currentValue={formFields.gender}
            handleChange={(e: any) => {
              setFormFields({ ...formFields, gender: e.target.value });
            }}
          />
          <FormField
            label="Age:"
            placeholder="Enter age"
            onChange={(e: any) => {
              setFormFields({ ...formFields, age: e.target.value });
            }}
            value={formFields.age ? formFields.age.toString() : ""}
          />
          <FormField
            label="Notes:"
            placeholder="Additional details about the patient (eg. wounds, clothes ...)"
            onChange={(e: any) => {
              setFormFields({ ...formFields, notes: e.target.value });
            }}
            value={formFields.notes}
          />
        </form>
        <CompletePatientButton
          handleClick={handleComplete}
          disableButton={
            formFields.barcodeValue && formFields.triage ? false : true
          }
        />
      </div>
    </div>
  );
};

export default PatientProfilePage;
