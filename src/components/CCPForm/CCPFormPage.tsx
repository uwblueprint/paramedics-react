import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Typography from '@material-ui/core/Typography';
import { Box, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Colours } from '../../styles/Constants';
import CompleteButton from './CompleteButton';
import Map from '../EventCreation/Map';
import FormField from '../common/FormField';
import {
  GET_CCP_BY_ID,
  GET_CCPS_BY_EVENT_ID,
  CCP,
} from '../../graphql/queries/ccps';
import { ADD_CCP, EDIT_CCP } from '../../graphql/mutations/ccps';

const useStyles = makeStyles({
  ccpCompleteDiv: {
    marginBottom: 71,
    marginTop: 31,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ccpCancelBtn: {
    minWidth: '228px',
    alignSelf: 'center',
    fontSize: '18px',
    fontWeight: 500,
    color: Colours.Secondary,
  },
});

const CCPFormPage = ({
  match: {
    params: { eventId, ccpId },
  },
  mode,
}: {
  match: {
    params: {
      eventId: string;
      ccpId?: string;
    };
  };
  mode: string;
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const { data } = useQuery(
    mode === 'edit' ? GET_CCP_BY_ID : GET_CCPS_BY_EVENT_ID,
    {
      variables: { id: ccpId, eventId },
    }
  );

  const collectionPoint: CCP = data ? data.collectionPoint : null;

  const [ccpName, setCCPName] = useState<string>('');

  useEffect(() => {
    setCCPName(collectionPoint ? collectionPoint.name : '');
  }, [collectionPoint]);

  // TODO: Add actual location
  const [eventLocation, setEventLocation] = useState<string>('');

  const [addCCP] = useMutation(ADD_CCP, {
    update(cache, { data: { addCollectionPoint } }) {
      // Update GET_CCPS_BY_EVENT_ID
      const { collectionPointsByEvent } = cache.readQuery<any>({
        query: GET_CCPS_BY_EVENT_ID,
        variables: { eventId },
      });

      cache.writeQuery({
        query: GET_CCPS_BY_EVENT_ID,
        variables: { eventId },
        data: {
          collectionPointsByEvent: collectionPointsByEvent.concat([
            addCollectionPoint,
          ]),
        },
      });
    },
    onCompleted() {
      enqueueSnackbar('CCP added.');
      // TODO: Check for valid eventId
      history.replace(`/events/${eventId}`);
    },
  });

  const [editCCP] = useMutation(EDIT_CCP, {
    onCompleted() {
      enqueueSnackbar('CCP edited.');
      // TODO: Check for valid eventId
      history.replace(`/events/${eventId}`);
    },
  });

  const handleNameChange = (e: any) => {
    setCCPName(e.target.value);
  };
  const handleLocationChange = (e: any) => {
    setEventLocation(e.target.value);
  };

  const handleCancel = () => {
    history.replace(`/events/${eventId}`);
  };

  const handleComplete = () => {
    // TODO: Change User ID to the current user

    if (mode === 'edit') {
      editCCP({
        variables: {
          id: ccpId,
          name: ccpName,
          eventId,
        },
      });
    } else {
      addCCP({
        variables: {
          name: ccpName,
          eventId,
          createdBy: 1,
        },
      });
    }
  };

  const content = (
    <ValidatorForm onSubmit={handleComplete}>
      <FormField
        label="Name:"
        placeholder="Create A Name"
        isValidated
        onChange={handleNameChange}
        value={ccpName}
      />
      <FormField
        label="CCP Location:"
        placeholder="Enter Location Here"
        isValidated
        onChange={handleLocationChange}
        value={eventLocation}
      />
      <Map />
      <div className={classes.ccpCompleteDiv}>
        <CompleteButton disabled={ccpName === ''} buttonText="Complete" />
      </div>
    </ValidatorForm>
  );

  return (
    <Box minHeight="100vh">
      <Box
        display="flex"
        justifyContent="space-between"
        padding="56px 56px 36px 56px"
        borderBottom={`1px solid ${Colours.BorderLightGray}`}
      >
        <Typography variant="h4">
          {mode === 'new' ? 'Add New CCP' : 'Edit CCP'}
        </Typography>
        <Button
          color="secondary"
          variant="outlined"
          className={classes.ccpCancelBtn}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>
      <Box padding="56px">{content}</Box>
    </Box>
  );
};

export default CCPFormPage;
