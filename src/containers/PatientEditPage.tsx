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
} from "../graphql/queries/templates/patients";
import {
  ADD_PATIENT,
  EDIT_PATIENT,
} from "../graphql/mutations/templates/patients";
import { CCPType } from "../graphql/queries/templates/collectionPoints";

interface FormFields {
  barcodeValue: string;
  triage: triageLevel;
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

const PatientEditPage = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: string } };
}) => {
  const { data, loading } = useQuery(GET_PATIENT_BY_ID(id));
  const patients: Array<PatientType> = data ? data.patient : [];

  // We need the CCP passed in!
  const [formFields, setFormFields] = useState<FormFields>({
    barcodeValue: "",
    triage: triageLevel.RED,
    gender: "",
    age: null,
    notes: "",
    status: null,
    runNumber: null,
    collectionPointId: 3,
  });

  useEffect(() => {
    if (!loading) {
      const {
        barcodeValue,
        triageLevel,
        gender,
        age,
        notes,
        status,
      }: {
        barcodeValue: string;
        triageLevel: triageLevel;
        gender: string;
        age: number;
        notes: string;
        status: status;
      } = data.patient;
      setFormFields({
        ...formFields,
        barcodeValue,
        triage: triageLevel,
        gender,
        age,
        notes,
        status,
      });
    }
  }, [data]);

  const [editPatient] = useMutation(EDIT_PATIENT);

  const handleComplete = () => {
    editPatient({
      variables: {
        id,
        gender: formFields.gender,
        age: formFields.age ? parseInt(formFields.age.toString(), 10) : -1,
        runNumber: formFields.runNumber,
        barcodeValue: formFields.barcodeValue
          ? parseInt(formFields.barcodeValue.toString(), 10)
          : -1,
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
          <Typography variant="h3">Edit patient</Typography>
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
        <CompletePatientButton
          handleClick={handleComplete}
          // disableButton={true}
        />
      </div>
    </div>
  );
};

export default PatientEditPage;
