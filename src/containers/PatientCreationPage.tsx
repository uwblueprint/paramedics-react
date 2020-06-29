import React, { useState } from "react";
import "../styles/EventCreationPage.css";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormField from "../components/EventCreationPage/FormField";
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
  GET_ALL_PATIENTS,
} from "../graphql/queries/templates/patients";
import { ADD_PATIENT } from "../graphql/mutations/templates/patients";
import { assertNonNullType } from "graphql";

interface FormFields {
  barcodeValue: number | null;
  triage: triageLevel; //TODO: change to enum
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

const PatientCreationPage = () => {
  const { data } = useQuery(GET_ALL_PATIENTS);
  const patients: Array<PatientType> = data ? data.patients : [];

  const [addPatient] = useMutation(ADD_PATIENT, {
    update(cache, { data: { addPatient } }) {
      cache.writeQuery({
        query: GET_ALL_PATIENTS,
        data: { patients: patients.concat([addPatient]) },
      });
    },
  });

  // We need the CCP passed as prop!
  const [formFields, setFormFields] = useState<FormFields>({
    barcodeValue: null,
    triage: triageLevel.RED,
    gender: "",
    age: null,
    notes: "",
    status: null,
    runNumber: null,
    collectionPointId: 7, // Make sure this is passed in
  });

  const handleComplete = () => {
    console.log(formFields.barcodeValue);
    addPatient({
      variables: {
        gender: formFields.gender,
        age: formFields.age,
        runNumber: formFields.runNumber,
        barcodeValue: formFields.barcodeValue,
        collectionPointId: formFields.collectionPointId,
        status: formFields.status,
        triageCategory: formFields.triageCategory,
        triageLevel: formFields.triage,
        notes: formFields.notes,
        transportTime: new Date(),
      },
    });
  };

  // Need to set up complete state and setComplete handler

  return (
    <div className="landing-wrapper">
      <div className="event-creation-top-section">
        <div className="landing-top-bar">
          <Typography variant="h3">Add a new patient</Typography>
          <div className="user-icon">
            <Button
              variant="outlined"
              color="primary"
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
            placeholder="Enter code"
            onChange={(e: any) => {
              setFormFields({
                ...formFields,
                barcodeValue: parseInt(e.target.value),
              });
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
              setFormFields({ ...formFields, age: parseInt(e.target.value) });
            }}
            value={formFields.age ? formFields.age : ""}
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
        <CompletePatientButton handleClick={handleComplete} />
      </div>
    </div>
  );
};

export default PatientCreationPage;
