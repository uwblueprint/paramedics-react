import React, { useState } from 'react';
import { Box, Button, Typography, makeStyles } from '@material-ui/core';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import CompleteBarcodeButton from './CompleteBarcodeButton';
import { Colours } from '../../styles/Constants';
import FormField from '../common/FormField';
import { GET_ALL_PATIENTS } from '../../graphql/queries/patients';
import {
  CCPDashboardTabOptions,
  CCPDashboardTabMap,
} from '../CCPDashboard/CCPDashboardPage';

type LocationState = { from: 'patientOverview' | 'hospital' | null };

const useStyles = makeStyles({
  barcodeCancelBtn: {
    minWidth: '228px',
    alignSelf: 'center',
    display: 'flex',
  },
});

const EnterBarcodePage = ({
  match: {
    params: { eventId, ccpId },
  },
}: {
  match: { params: { eventId: string; ccpId: string } };
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { pathname } = history.location;
  const location = useLocation<LocationState>();
  const { from } = location.state || {
    from: CCPDashboardTabMap[CCPDashboardTabOptions.PatientOverview],
  };
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
          `/events/${patientEventId}/ccps/${patientCcpId}/patients/${id}`,
          { from }
        );
      } else {
        // No existing patient
        history.push(
          `/events/${eventId}/ccps/${ccpId}/patients/new/${barcode}`,
          { from }
        );
      }
    } else {
      history.push(`/events/${eventId}/ccps/${ccpId}/patients/new/${barcode}`, {
        from,
      });
    }
  };

  const handleFormSubmit = (e) => {
    return barcode !== '' ? handleEnterBarcode() : e.preventDefault();
  };

  return (
    <Box minHeight="100vh">
      <Box
        display="flex"
        justifyContent="space-between"
        padding="56px 56px 36px 56px"
        borderBottom={`1px solid ${Colours.BorderLightGray}`}
      >
        <Typography variant="h4">Enter Barcode</Typography>
        <Button
          color="secondary"
          variant="outlined"
          component={NavLink}
          className={classes.barcodeCancelBtn}
          to={`${pathname.split('/manual')[0]}/${from}`}
        >
          Cancel
        </Button>
      </Box>
      <Box padding="56px">
        <form onSubmit={handleFormSubmit}>
          <FormField
            label="Barcode:"
            placeholder="Enter barcode here"
            onChange={(e: any) => setBarcode(e.target.value)}
            value={barcode}
            isValidated={false}
          />
        </form>
      </Box>
      <CompleteBarcodeButton
        handleClick={handleEnterBarcode}
        isEmpty={barcode === ''}
      />
    </Box>
  );
};

export default EnterBarcodePage;
