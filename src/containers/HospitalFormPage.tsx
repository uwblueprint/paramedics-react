import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/ResourceCreationPage.css';
import Typography from '@material-ui/core/Typography';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import FormField from '../components/common/FormField';
import BackLink from '../components/ResourceFormPage/BackLink';
import CancelButton from '../components/ResourceFormPage/CancelButton';
import DoneButton from '../components/ResourceFormPage/DoneButton';
import { Colours } from '../styles/Constants';
import { ADD_HOSPITAL, EDIT_HOSPITAL } from '../graphql/mutations/hospitals';
import {
  Hospital,
  GET_ALL_HOSPITALS,
  GET_HOSPITAL_BY_ID,
} from '../graphql/queries/hospitals';

const HospitalFormPage = ({
  match: {
    params: { mode, hospitalId },
  },
}: {
  match: { params: { mode: string; hospitalId?: string } };
}) => {
  const history = useHistory();

  const { data, loading } = useQuery(
    mode === 'edit' && hospitalId
      ? GET_HOSPITAL_BY_ID(hospitalId)
      : GET_ALL_HOSPITALS
  );

  const hospitals: Array<Hospital> = data ? data.hospitals : [];
  const [addHospital] = useMutation(ADD_HOSPITAL, {
    update(cache, { data: { newHospital } }) {
      cache.writeQuery({
        query: GET_ALL_HOSPITALS,
        data: { hospitals: hospitals.concat([newHospital]) },
      });
    },
  });
  const [editHospital] = useMutation(EDIT_HOSPITAL);

  const [hospitalName, setHospitalName] = useState<string>('');

  useEffect(() => {
    if (!loading && mode === 'edit') {
      const {
        name,
      }: {
        name: string;
      } = data.hospital;
      setHospitalName(name);
    }
  }, [data]);

  const handleNameChange = (e: any) => {
    setHospitalName(e.target.value);
  };

  const handleComplete = () => {
    if (mode === 'new') {
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
    history.replace('/manage');
  };

  return (
    <div className="resource-add-wrapper">
      <div className="resource-creation-top-section">
        <BackLink to="/manage" />
        <div className="resource-header">
          <Typography variant="h4">
            {mode === 'new' ? 'Add a new hospital' : 'Edit Hospital'}
          </Typography>
        </div>
      </div>
      <div className="event-form">
        <form>
          <FormField
            label="Hospital Name:"
            required
            isValidated={false}
            onChange={handleNameChange}
            value={hospitalName}
          />
        </form>
        <div className="caption">
          <Typography
            variant="caption"
            style={{ color: Colours.SecondaryGray }}
          >
            *Denotes a required field
          </Typography>
        </div>
      </div>
      <div className="done-container">
        <DoneButton
          handleClick={handleComplete}
          disabled={hospitalName === ''}
        />
      </div>
      <div className="cancel-container">
        <CancelButton to="/manage" />
      </div>
    </div>
  );
};

export default HospitalFormPage;
