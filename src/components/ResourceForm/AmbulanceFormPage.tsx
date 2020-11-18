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
} from '../../graphql/queries/ambulances';
import FormField from '../common/FormField';
import ConfirmModal from '../common/ConfirmModal';
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
    justifyContent: 'space-between',
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
  const { data, loading } = useQuery(GET_ALL_AMBULANCES);
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
      history.replace('/manage/ambulances');
    },
  });
  const [editAmbulance] = useMutation(EDIT_AMBULANCE, {
    onCompleted() {
      enqueueSnackbar('Ambulance edited.');
      history.replace('/manage/ambulances');
    },
  });

  const [ambulanceNumber, setAmbulanceNumber] = useState<string>('');
  const [openValidationError, setOpenValidationError] = useState<boolean>(
    false
  );

  useEffect(() => {
    if (!loading && mode === 'edit') {
      const {
        vehicleNumber,
      }: {
        vehicleNumber: number;
      } = data.ambulances.find((ambulance) => ambulance.id === ambulanceId);
      setAmbulanceNumber(vehicleNumber.toString());
    }
  }, [data, loading, mode]);

  const handleNumberChange = (e: any) => {
    setAmbulanceNumber(e.target.value);
  };

  const openErrorModal = () => {
    setOpenValidationError(true);
  };

  const closeErrorModal = () => {
    setOpenValidationError(false);
  };

  const handleComplete = () => {
    const duplicateExists = ambulances.some(
      (ambulance) => ambulance.vehicleNumber.toString() === ambulanceNumber
    );
    if (duplicateExists) {
      openErrorModal();
    } else if (mode === 'new') {
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
  };

  const classes = useStyles();

  return (
    <div className={classes.resourceWrapper}>
      <div className={classes.resourceCreationTopSection}>
        <div className={classes.resourceHeader}>
          <Typography variant="h4">
            {mode === 'new' ? 'Add a new ambulance' : 'Edit Ambulance'}
          </Typography>
          <CancelButton to="/manage/ambulances" />
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
      <ConfirmModal
        open={openValidationError}
        title="Duplicate Ambulance"
        body="You cannot add this ambulance as this ambulance already exists in the system."
        actionLabel="Okay"
        handleClickAction={closeErrorModal}
        handleClickCancel={closeErrorModal}
      />
    </div>
  );
};

export default AmbulanceFormPage;
