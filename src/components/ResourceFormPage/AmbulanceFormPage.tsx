import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, makeStyles } from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import {
  ADD_AMBULANCE,
  EDIT_AMBULANCE,
} from '../../graphql/mutations/ambulances';
import {
  Ambulance,
  GET_ALL_AMBULANCES,
  GET_AMBULANCE_BY_ID,
} from '../../graphql/queries/ambulances';
import FormField from '../common/FormField';
import BackLink from './BackLink';
import CancelButton from './CancelButton';
import DoneButton from './DoneButton';
import { Colours } from '../../styles/Constants';

const useStyles = makeStyles({
  resourceWrapper: {
    backgroundColor: 'white',
  },
  resourceCreationTopSection: {
    margin: '48px 30px 0px 30px',
    backgroundColor: 'white',
    borderBottom: '1px solid #c4c4c4',
  },
  resourceHeader: {
    display: 'flex',
    padding: '16px 0px',
  },
  resourceForm: {
    padding: '30px',
  },
});

const AmbulanceFormPage = ({
  match: {
    params: { mode, ambulanceId },
  },
}: {
  match: { params: { mode: string; ambulanceId?: string } };
}) => {
  const history = useHistory();
  const { data, loading } = useQuery(
    mode === 'edit' && ambulanceId
      ? GET_AMBULANCE_BY_ID(ambulanceId)
      : GET_ALL_AMBULANCES
  );

  const ambulances: Array<Ambulance> = data ? data.ambulances : [];
  const [addAmbulance] = useMutation(ADD_AMBULANCE, {
    update(cache, { data: { addAmbulance } }) {
      cache.writeQuery({
        query: GET_ALL_AMBULANCES,
        data: { ambulances: ambulances.concat([addAmbulance]) },
      });
    },
  });
  const [editAmbulance] = useMutation(EDIT_AMBULANCE);

  const [ambulanceNumber, setAmbulanceNumber] = useState<number>(0);

  useEffect(() => {
    if (!loading && mode === 'edit') {
      const {
        vehicleNumber,
      }: {
        vehicleNumber: number;
      } = data.ambulance;
      setAmbulanceNumber(vehicleNumber);
    }
  }, [data, loading]);

  const handleNumberChange = (e: any) => {
    setAmbulanceNumber(e.target.value);
  };

  const handleComplete = () => {
    if (mode === 'new') {
      addAmbulance({
        variables: {
          vehicleNumber: parseInt(ambulanceNumber.toString()),
        },
      });
    } else if (mode === 'edit') {
      editAmbulance({
        variables: {
          id: ambulanceId,
          vehicleNumber: parseInt(ambulanceNumber.toString()),
        },
      });
    }

    history.replace('/manage');
  };

  const classes = useStyles();

  return (
    <div className={classes.resourceWrapper}>
      <div className={classes.resourceCreationTopSection}>
        <BackLink to="/manage" />
        <div className={classes.resourceHeader}>
          <Typography variant="h4">
            {mode === 'new' ? 'Add a new ambulance' : 'Edit Ambulance'}
          </Typography>
        </div>
      </div>
      <div className={classes.resourceForm}>
        <form>
          <FormField
            label="Ambulance Number:"
            required
            isValidated={false}
            onChange={handleNumberChange}
            value={ambulanceNumber}
          />
        </form>
        <Typography variant="caption" style={{ color: Colours.SecondaryGray }}>
          *Denotes a required field
        </Typography>
      </div>
      <DoneButton
        handleClick={handleComplete}
        disabled={ambulanceNumber === 0}
      />
      <CancelButton to="/manage" />
    </div>
  );
};

export default AmbulanceFormPage;
