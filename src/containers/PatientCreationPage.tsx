import React, { useState } from "react";
import "../styles/EventCreationPage.css";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormField from "../components/EventCreationPage/FormField";
import CompletePatientButton from "../components/PatientCreationPage/CompletePatientButton";
import RadioSelector from "../components/common/RadioSelector";
import TriagePills from "../components/PatientCreationPage/TriagePills";
import { usePatientMutation } from "../graphql/mutations/hooks/patients"

interface FormFields {
  barcode: string;
  triage: string; //TODO: change to enum
  gender: string; //TOOD: change to enum
  age: number | null;
  notes: string;
}

const PatientCreationPage = () => {
  const [formFields, setFormFields] = useState<FormFields>({
    barcode: "",
    triage: "red",
    gender: "",
    age: null,
    notes: "",
  });

  // Need to set up complete state and setComplete handler
  // Need to also import enum and incorporate into triage pills
  usePatientMutation ({
    gender: formFields.gender,
    barcodeValue: formFields.barcode,
    age: formFields.age,
    notes: formFields.notes,
    triageLevel: formFields.triage,
  }
  complete, 
  setComplete)
  
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
              setFormFields({ ...formFields, barcode: e.target.value });
            }}
            value={formFields.barcode}
          />
          <TriagePills
            currentStatus={formFields.triage}
            handleChange={(
              e: React.MouseEvent<HTMLElement>,
              newTriage: string
            ) => {
              console.log("change to ");
              console.log(newTriage);
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
