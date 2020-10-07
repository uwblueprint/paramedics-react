import React, { useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { NavLink, useHistory } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import CompleteBarcodeButton from './CompleteBarcodeButton';
import { Colours } from '../../styles/Constants';

import FormField from '../common/FormField';
import { GET_ALL_PATIENTS } from '../../graphql/queries/patients';

const EnterBarcodePage = ({
  match: {
    params: { eventId, ccpId },
  },
}: {
  match: { params: { eventId: string; ccpId: string } };
}) => {
  const history = useHistory();
  const { pathname } = history.location;
  const { data, loading } = useQuery(GET_ALL_PATIENTS);
  const [barcode, setBarcode] = useState<string>('');

  const handleEnterBarcode = () => {
    if (!loading && data) {
      const selectedPatient = data.patients.filter(
        (patient) => patient.barcodeValue === barcode
      );
      if (selectedPatient.length > 0) {
        // Found patient
        const {
          collectionPointId: {
            id: patientCcpId,
            eventId: { id: patientEventId },
          },
          id,
        } = selectedPatient[0];
        // Redirect to patient profile
        history.push(
          `/events/${patientEventId}/ccps/${patientCcpId}/patients/${id}`
        );
      } else {
        // No existing patient
        history.push(
          `/events/${eventId}/ccps/${ccpId}/patients/new/${barcode}`
        );
      }
    } else {
      history.push(`/events/${eventId}/ccps/${ccpId}/patients/new/${barcode}`);
    }
  };

  return (
    <Box minHeight="100vh">
      <Box
        display="flex"
        justifyContent="space-between"
        padding="56px 56px 36px 56px"
        borderBottom={`1px solid ${Colours.BorderLightGray}`}
      >
        <Typography variant="h3">Enter Barcode</Typography>
        <Button
          color="secondary"
          component={NavLink}
          to={pathname.split('/manual')[0]}
        >
          Cancel
        </Button>
      </Box>
      <Box padding="56px">
        <form onSubmit={handleEnterBarcode}>
          <FormField
            label="Barcode:"
            placeholder="Enter barcode here"
            onChange={(e: any) => setBarcode(e.target.value)}
            value={barcode}
            isValidated={false}
          />
        </form>
      </Box>
      <CompleteBarcodeButton handleClick={handleEnterBarcode} />
    </Box>
  );
};

export default EnterBarcodePage;
