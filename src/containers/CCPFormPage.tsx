import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/EventCreationPage.css';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Colours } from '../styles/Constants';
import CompleteButton from '../components/CCPForm/CompleteButton';
import Map from '../components/EventCreationPage/Map';
import FormField from '../components/common/FormField';
import { GET_ALL_CCPS, GET_CCP_BY_ID, CCP } from '../graphql/queries/ccps';
import ADD_CCP from '../graphql/mutations/ccps';

const CCPFormPage = ({
  match: { 
    params: { eventID, ccpID } 
  },
  mode,
}: {
  match: {
    params: {
      eventID: string
      ccpID?: string
    };
  };
  mode: string;
}) => {
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
      display: "flex",
      marginLeft: "auto",
      alignSelf: "center",
    }
  });

  const classes = useStyles();
  const history = useHistory();

  const [ccpName, setCCPName] = useState<string>('');
  const [eventLocation, setEventLocation] = useState<string>('');

  const { data } = mode === "new" ? useQuery(GET_ALL_CCPS) : useQuery(GET_CCP_BY_ID, {
    variables: { id: ccpID }
  });

  const collectionPoints: Array<CCP> = data ? data.collectionPoints : [];

  const [addCCP] = useMutation(ADD_CCP, {
    update(cache, { data: { addCollectionPoint } }) {
      cache.writeQuery({
        query: GET_ALL_CCPS,
        data: { collectionPoints: collectionPoints.concat([addCollectionPoint]) },
      });
    },
  });

  const handleNameChange = (e: any) => {
    setCCPName(e.target.value);
  };
  const handleLocationChange = (e: any) => {
    setEventLocation(e.target.value);
  };

  const handleCancel = () => {
    history.replace(`/events/${eventID}`);
  }

  const handleComplete = () => {

    // TODO: Change User ID to the current user
    addCCP({
      variables: {
        name: ccpName,
        eventId: eventID,
        createdBy: 1,
      },
    });

    // TODO: Check for valid eventID

    history.replace(`/events/${eventID}`);
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
        <CompleteButton
          disabled={eventLocation === "" || ccpName === ""}
          buttonText={mode === "new" ? "Complete" : "Update"}
        />
      </div>
    </ValidatorForm>
  );

  return (
    <div className={classes.ccpWrapper}>
      <div className={classes.ccpFormTopSection}>
        <div className={classes.ccpHeader}>
          <Typography variant="h3">{mode === "new" ? "Create a CCP" : "Edit CCP"}</Typography>
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
