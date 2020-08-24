import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { NavLink, useHistory } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import CompleteBarcodeButton from './CompleteBarcodeButton';

import FormField from '../common/FormField';
import { FETCH_ALL_PATIENTS } from '../../graphql/queries/patients';

const EnterBarcodePage = ({
  match: {
    params: { eventID, ccpID },
  },
}: {
  match: { params: { eventID: string; ccpID: string } };
}) => {
  const history = useHistory();
  const { pathname } = history.location;
  const { data, loading } = useQuery(FETCH_ALL_PATIENTS);
  const [barcode, setBarcode] = useState<string>('');

  const handleEnterBarcode = () => {
    if (!loading && data) {
      const selectedPatient = data.patients.filter(
        (patient) => patient.barcodeValue.toString() === barcode
      );
      if (selectedPatient.length > 0) {
        // Found patient
        const {
          collectionPointId: {
            id: patientCCPId,
            eventId: { id: patientEventId },
          },
          id,
        } = selectedPatient[0];
        // Redirect to patient profile
        history.replace(
          `/events/${patientEventId}/ccps/${patientCCPId}/patients/${id}`
        );
      } else {
        // No existing patient
        history.replace(
          `/events/${eventID}/ccps/${ccpID}/patients/new/${barcode}`
        );
      }
    }
    history.replace(`/events/${eventID}/ccps/${ccpID}/patients/new/${barcode}`);
  };

  return (
    <div className="landing-wrapper">
      <div className="landing-top-section">
        <div className="landing-top-bar">
          <Typography variant="h3">Enter Barcode</Typography>
          <div className="user-icon">
            <Button
              variant="outlined"
              color="secondary"
              component={NavLink}
              to={pathname.split('/manual')[0]}
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
        <form>
          <FormField
            label="Barcode:"
            placeholder="Enter barcode here"
            onChange={(e: any) => setBarcode(e.target.value)}
            value={barcode}
            isValidated={false}
          />
        </form>
      </div>
      <CompleteBarcodeButton handleClick={handleEnterBarcode} />
    </div>
  );
};

export default EnterBarcodePage;
