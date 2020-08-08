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
import NextButton from '../components/CCPForm/NextButton';
import Map from '../components/EventCreationPage/Map';
import FormField from '../components/common/FormField';
import { GET_ALL_CCPS, CCP } from '../graphql/queries/ccps';
import ADD_CCP from '../graphql/mutations/ccps';

const CCPFormPage = () => {
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
  });

  const classes = useStyles();
  const history = useHistory();

  const [ccpName, setCCPName] = useState<string>('');
  const [eventLocation, setEventLocation] = useState<string>('');

  const { data } = useQuery(GET_ALL_CCPS);
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

  const handleComplete = () => {
    addCCP({
      variables: {
        name: ccpName,
        eventId: 1,
        createdBy: 1,
      },
    });
  };

  const content = (
    <ValidatorForm onSubmit={handleComplete}>
      <FormField
        label="Name:"
        placeholder="Create A Name"
        isValidated={ccpName !== ""}
        onChange={handleNameChange}
        value={ccpName}
      />
      <FormField
        label="Event Location:"
        placeholder="Enter Location Here"
        isValidated={eventLocation !== ""}
        onChange={handleLocationChange}
        value={eventLocation}
      />
      <Map />
      <div className={classes.ccpCompleteDiv}>
        <NextButton
          handleClick={() => {}}
          disabled={eventLocation === "" || ccpName === ""}
          buttonText="Complete"
        />
      </div>
    </ValidatorForm>
  );

  return (
    <div className={classes.ccpWrapper}>
      <div className={classes.ccpFormTopSection}>
        <div className={classes.ccpHeader}>
          <Typography variant="h3">Create a CCP</Typography>
          <div className="user-icon">
            <Button
              color="primary"
              style={{
                minWidth: '107px',
                minHeight: '48px',
                fontSize: '18px',
                fontWeight: 500,
                color: Colours.Secondary,
              }}
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
