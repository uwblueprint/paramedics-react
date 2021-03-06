import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Typography, makeStyles } from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import FormField from '../common/FormField';
import ConfirmModal from '../common/ConfirmModal';
import CancelButton from './CancelButton';
import DoneButton from './DoneButton';
import { Colours } from '../../styles/Constants';
import { ADD_HOSPITAL, EDIT_HOSPITAL } from '../../graphql/mutations/hospitals';
import { Hospital, GET_ALL_HOSPITALS } from '../../graphql/queries/hospitals';

const useStyles = makeStyles({
  resourceWrapper: {
    backgroundColor: Colours.White,
  },
  resourceCreationTopSection: {
    margin: '48px 30px 0px 30px',
    backgroundColor: Colours.White,
    borderBottom: `1px solid ${Colours.BorderLightGray}`,
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

const HospitalFormPage = ({
  match: {
    params: { mode, hospitalId },
  },
}: {
  match: { params: { mode: string; hospitalId?: string } };
}) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading } = useQuery(GET_ALL_HOSPITALS);

  const hospitals: Array<Hospital> = data ? data.hospitals : [];
  const [addHospital] = useMutation(ADD_HOSPITAL, {
    update(cache, { data: { addHospital } }) {
      cache.writeQuery({
        query: GET_ALL_HOSPITALS,
        data: { hospitals: hospitals.concat([addHospital]) },
      });
    },
    onCompleted({ addHospital }) {
      enqueueSnackbar('Hospital added.');
      history.replace('/manage/hospitals', {
        updatedResourceId: addHospital.id,
      });
    },
  });
  const [editHospital] = useMutation(EDIT_HOSPITAL, {
    onCompleted() {
      enqueueSnackbar('Hospital edited.');
      history.replace('/manage/hospitals', { updatedResourceId: hospitalId });
    },
  });

  const [hospitalName, setHospitalName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && mode === 'edit') {
      const {
        name,
      }: {
        name: string;
      } = data.hospitals.find((hospital) => hospital.id === hospitalId);
      setHospitalName(name);
    }
  }, [data, hospitalId, loading, mode]);

  const handleNameChange = (e: any) => {
    setHospitalName(e.target.value);
  };

  const openErrorModal = () => {
    setIsModalOpen(true);
  };

  const closeErrorModal = () => {
    setIsModalOpen(false);
  };

  const handleComplete = () => {
    const duplicateExists = hospitals.some(
      (hospital) => hospital.name.toString() === hospitalName
    );
    if (duplicateExists) {
      openErrorModal();
    } else if (mode === 'new') {
      addHospital({
        variables: {
          name: hospitalName,
        },
      });
    } else if (mode === 'edit') {
      editHospital({
        variables: {
          id: hospitalId,
          name: hospitalName,
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
            {mode === 'new' ? 'Add a new hospital' : 'Edit Hospital'}
          </Typography>
          <CancelButton to="/manage/hospitals" />
        </div>
      </div>
      <div className={classes.resourceForm}>
        <form>
          <FormField
            label="*Hospital Name:"
            isValidated={false}
            onChange={handleNameChange}
            value={hospitalName}
          />
        </form>
        <Typography variant="caption" style={{ color: Colours.SecondaryGray }}>
          *Denotes a required field
        </Typography>
      </div>
      <DoneButton handleClick={handleComplete} disabled={hospitalName === ''} />
      <ConfirmModal
        open={isModalOpen}
        title="Duplicate Hospital"
        body="You cannot add this hospital as this hospital already exists in the system."
        actionLabel="Okay"
        handleClickAction={closeErrorModal}
        handleClickCancel={closeErrorModal}
      />
    </div>
  );
};

export default HospitalFormPage;
