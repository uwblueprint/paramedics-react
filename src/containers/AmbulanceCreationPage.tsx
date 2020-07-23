import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import { ADD_AMBULANCE, EDIT_AMBULANCE } from '../graphql/mutations/ambulances';
import {
  Ambulance,
  GET_ALL_AMBULANCES,
  GET_AMBULANCE_BY_ID,
} from '../graphql/queries/ambulances';
import '../styles/ResourceCreationPage.css';
import FormField from '../components/common/FormField';
import BackLink from '../components/ResourceCreationPage/BackLink';
import CancelButton from '../components/ResourceCreationPage/CancelButton';
import DoneButton from '../components/ResourceCreationPage/DoneButton';
import { Colours } from '../styles/Constants';

const AmbulanceCreationPage = ({
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
  }, [data]);

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

    history.replace('/manage/ambulances');
  };

  return (
    <div className="resource-add-wrapper">
      <div className="resource-creation-top-section">
        <BackLink to="/manage/ambulances" />
        <div className="resource-header">
          <Typography variant="h4">
            {mode === 'new' ? 'Add a new ambulance' : 'Edit Ambulance'}
          </Typography>
        </div>
      </div>
      <div className="event-form">
        <form>
          <FormField
            label="Ambulance Number:"
            required
            isValidated={false}
            onChange={handleNumberChange}
            value={ambulanceNumber}
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
          disabled={ambulanceNumber === 0}
        />
      </div>
      <div className="cancel-container">
        <CancelButton to="/manage/ambulances" />
      </div>
    </div>
  );
};

export default AmbulanceCreationPage;
