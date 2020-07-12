import React, { useState, useEffect } from "react";
import "../styles/HomeLandingPage.css";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormField from "../components/common/FormField";

const EnterBarcodePage = ({
  match: {
    params: { barcode },
  },
}: {
  match: { params: { barcode?: string } };
}) => {
  const [currentBarcode, setCurrentBarcode] = useState<string>("");
  useEffect(() => {
    if (barcode) {
      setCurrentBarcode(barcode);
    }
  }, [barcode]);
  return (
    <div className="landing-wrapper">
      <div className="landing-top-section">
        <div className="landing-top-bar">
          <Typography variant="h3">Enter Barcode</Typography>
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
            placeholder="Enter barcode here"
            onChange={(e: any) => setCurrentBarcode(e.target.value)}
            value={currentBarcode}
            isValidated={false}
          />
        </form>
      </div>
    </div>
  );
};

export default EnterBarcodePage;
