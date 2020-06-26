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
import { usePatientMutation } from "../graphql/mutations/hooks/patients";
import {
  triageLevel,
  status,
  PatientType,
  GET_ALL_PATIENTS,
} from "../graphql/queries/templates/patients";
import { ADD_PATIENT } from "../graphql/mutations/templates/patients";
import { CCPType } from "../graphql/queries/templates/collectionPoints";

interface FormFields {
  barcodeValue: string;
  triage: triageLevel; //TODO: change to enum
  gender: string;
  age: number | null;
  notes: string;
  runNumber?: number | null;
  collectionPointId?: CCPType | null;
  status: status | null;
  triageCategory?: number | null;
}

const PatientCreationPage = () => {
  const { data } = useQuery(GET_ALL_PATIENTS);
  const patient: Array<PatientType> = data ? data.patients : [];

  // const [addPatient] = useMutation(ADD_PATIENT, {
  //   update(cache, { data: { addPatient } }) {
  //     cache.writeQuery({
  //       query: GET_ALL_PATIENTS,
  //       data: { patients: patients.concat([addPatient]) },
  //     });
  //   },
  // });

  // const handleComplete = () => {
  //   addPatient({
  //   variables: {
  //     formFields.gender,
  //     formFields.age,
  //     formFields.runNumber,
  //     formFields.barcodeValue,
  //     formFields.collectionPointId,
  //     formFields.status,
  //     formFields.triageCategory,
  //     formFields.triageLevel,
  //     formFields.notes,
  //     formFields.transportTime,
  //   },
  // });
  //
  // };

  // We need the CCP passed in!
  const [formFields, setFormFields] = useState<FormFields>({
    barcodeValue: "",
    triage: triageLevel.RED,
    gender: "",
    age: null,
    notes: "",
    status: null,
    runNumber: null,
  });

  // Need to set up complete state and setComplete handler
  // Need to also import enum and incorporate into triage pills

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
        <CompletePatientButton />
      </div>
    </div>
  );
};

export default PatientCreationPage;
