import React, { useState } from "react";
import "../styles/EventCreationPage.css";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormField from "../components/EventCreationPage/FormField";
import CompletePatientButton from "../components/PatientCreationPage/CompletePatientButton";
import RadioSelector from "../components/common/RadioSelector";
import TriagePills from "../components/PatientCreationPage/TriagePills";

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
            handleChange={(e: any) => {
              setFormFields({ ...formFields, triage: e.target.value });
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
