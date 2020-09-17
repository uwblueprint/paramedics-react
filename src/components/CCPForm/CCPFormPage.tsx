import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
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
  ccpWrapper: {
    backgroundColor: 'white',
  },
  ccpFormTopSection: {
    margin: '48px 30px 0px 30px',
    backgroundColor: 'white',
    borderBottom: '1px solid #c4c4c4',
  },
  ccpHeader: {
    display: 'flex',
    padding: '16px 0px',
  },
  ccpForm: {
    padding: '56px 56px 101px 56px',
  },
  ccpCompleteDiv: {
    marginBottom: 71,
    marginTop: 31,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ccpCancelBtn: {
    minWidth: '107px',
    minHeight: '48px',
    fontSize: '18px',
    fontWeight: 500,
    color: Colours.Secondary,
  },
  ccpBtnPosition: {
    display: 'flex',
    marginLeft: 'auto',
    alignSelf: 'center',
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
  });

  const [editCCP] = useMutation(EDIT_CCP);

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

    // TODO: Check for valid eventId

    history.replace(`/events/${eventId}`);
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
        label="Event Location:"
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
    <div className={classes.ccpWrapper}>
      <div className={classes.ccpFormTopSection}>
        <div className={classes.ccpHeader}>
          <Typography variant="h3">
            {mode === 'new' ? 'Create a CCP' : 'Edit CCP'}
          </Typography>
          <div className={classes.ccpBtnPosition}>
            <Button
              color="primary"
              className={classes.ccpCancelBtn}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <div className={classes.ccpForm}>{content}</div>
    </div>
  );
};

export default CCPFormPage;
