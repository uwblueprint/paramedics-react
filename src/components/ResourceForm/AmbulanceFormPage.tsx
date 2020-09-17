import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
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
  const { enqueueSnackbar } = useSnackbar();
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
    onCompleted() {
      enqueueSnackbar('Ambulance added.');
    },
  });
  const [editAmbulance] = useMutation(EDIT_AMBULANCE, {
    onCompleted() {
      enqueueSnackbar('Ambulance edited.');
    },
  });

  const [ambulanceNumber, setAmbulanceNumber] = useState<string>('');

  useEffect(() => {
    if (!loading && mode === 'edit') {
      const {
        vehicleNumber,
      }: {
        vehicleNumber: number;
      } = data.ambulance;
      setAmbulanceNumber(vehicleNumber.toString());
    }
  }, [data, loading, mode]);

  const handleNumberChange = (e: any) => {
    setAmbulanceNumber(e.target.value);
  };

  const handleComplete = () => {
    if (mode === 'new') {
      addAmbulance({
        variables: {
          vehicleNumber: parseInt(ambulanceNumber),
        },
      });
    } else if (mode === 'edit') {
      editAmbulance({
        variables: {
          id: ambulanceId,
          vehicleNumber: parseInt(ambulanceNumber),
        },
      });
    }
    history.push('/manage/ambulances');
  };

  const classes = useStyles();

  return (
    <div className={classes.resourceWrapper}>
      <div className={classes.resourceCreationTopSection}>
        <BackLink to="/manage/ambulances" />
        <div className={classes.resourceHeader}>
          <Typography variant="h4">
            {mode === 'new' ? 'Add a new ambulance' : 'Edit Ambulance'}
          </Typography>
        </div>
      </div>
      <div className={classes.resourceForm}>
        <form>
          <FormField
            label="*Ambulance Number:"
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
        disabled={ambulanceNumber === ''}
      />
      <CancelButton to="/manage/ambulances" />
    </div>
  );
};

export default AmbulanceFormPage;
