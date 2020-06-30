import React, { useState } from "react";
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
  FETCH_ALL_PATIENTS,
} from "../graphql/queries/templates/patients";
import { ADD_PATIENT } from "../graphql/mutations/templates/patients";
import { CCPType } from "../graphql/queries/templates/collectionPoints";

interface FormFields {
  barcodeValue: string;
  triage: triageLevel;
  gender: string;
  age: number | null;
  notes: string;
  runNumber?: number | null;
  collectionPointId?: CCPType | null;
  status: status | null;
  triageCategory?: number | null;
  triageLevel?: number | null;
  transportTime?: number | null;
}

const PatientEditPage = ({ match: { params } }: { match: { params: any } }) => {
  const { data, loading, error } = useQuery(FETCH_ALL_PATIENTS);
  console.log("JASON: data");
  console.log(data, loading, error);
  const patients: Array<PatientType> = data ? data.patients : [];

  const [addPatient] = useMutation(ADD_PATIENT, {
    update(cache, { data: { addPatient } }) {
      cache.writeQuery({
        query: FETCH_ALL_PATIENTS,
        data: { patients: patients.concat([addPatient]) },
      });
    },
  });
  console.log(addPatient);

  // We need the CCP passed in!
  const [formFields, setFormFields] = useState<FormFields>({
    barcodeValue: "",
    triage: triageLevel.RED,
    gender: "",
    age: null,
    notes: "",
    status: null,
    runNumber: null,
    collectionPointId: {
      id: "7",
      name: "Checkpoint 0",
      eventId: { name: "St. Patricks", eventDate: new Date("2020-06-09") },
    },
  });

  const [errors, setErrors] = useState({
    barcodeValue: false,
    triage: false,
    gender: false,
    age: false,
    notes: false,
    runNumber: false,
    collectionPointId: false,
    status: false,
    triageCategory: false,
    triageLevel: false,
    transportTime: false,
  });

  const handleComplete = () => {
    // Validate that fields are filled in
    let error = false;
    // console.log("AAAAAA");
    // console.log("formFields", formFields);
    Object.entries(formFields).forEach((field) => {
      if (field[1] === "" || field[1] === null) {
        // Empty field
        setErrors({ ...errors, [field[0]]: true });
        error = true;
      } else {
        setErrors({ ...errors, [field[0]]: false });
      }
    });

    // if (error) return;

    addPatient({
      variables: {
        gender: formFields.gender,
        age: formFields.age,
        runNumber: formFields.runNumber,
        barcodeValue: formFields.barcodeValue,
        collectionPointId: formFields.collectionPointId,
        status: formFields.status,
        triageCategory: formFields.triageCategory,
        triageLevel: formFields.triageLevel,
        notes: formFields.notes,
        transportTime: formFields.transportTime,
      },
    });
  };

  // Need to set up complete state and setComplete handler
  console.log(errors);
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
            error={errors.barcodeValue}
            helperText={errors.barcodeValue ? "This is a mandatory field" : ""}
          />
          <StatusPills
            currentStatus={formFields.status}
            handleChange={(
              e: React.MouseEvent<HTMLElement>,
              newStatus: status
            ) => {
              setFormFields({ ...formFields, status: newStatus });
            }}
            error={errors.status}
            helperText={errors.status ? "This is a mandatory field" : ""}
          />
          <TriagePills
            currentStatus={formFields.triage}
            handleChange={(
              e: React.MouseEvent<HTMLElement>,
              newTriage: triageLevel
            ) => {
              setFormFields({ ...formFields, triage: newTriage });
            }}
            error={errors.triage}
            helperText={errors.triage ? "This is a mandatory field" : ""}
          />
          <RadioSelector
            labels={["Male", "Female"]}
            currentValue={formFields.gender}
            handleChange={(e: any) => {
              setFormFields({ ...formFields, gender: e.target.value });
            }}
            error={errors.gender}
            helperText={errors.gender ? "This is a mandatory field" : ""}
          />
          <FormField
            label="Age:"
            placeholder="Enter age"
            onChange={(e: any) => {
              setFormFields({ ...formFields, age: e.target.value });
            }}
            value={formFields.age ? formFields.age.toString() : ""}
            error={errors.age}
            helperText={errors.age ? "This is a mandatory field" : ""}
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

export default PatientEditPage;
