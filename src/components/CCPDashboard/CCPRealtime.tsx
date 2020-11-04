import React, { useState } from 'react';
import { useSubscription } from '@apollo/react-hooks';
import { PATIENTS_SUBSCRIPTION } from '../../graphql/subscriptions/patients';

interface Props {
  collectionPointId: string;
  handleUpdates: () => void;
}

export const CCPRealtime = (props: Props) => {
  const [listUpdates, setListUpdates] = useState([]);
  const { collectionPointId, handleUpdates } = props;

  const { data, loading } = useSubscription(PATIENTS_SUBSCRIPTION, {
    variables: { collectionPointId },
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      handleUpdates();
      //setListUpdates([...listUpdates, data]);
    },
  });

  const id: string = data ? data.patientUpdated.id : '';

  return (
    <div>
      <p>{loading ? '' : `patient ${id} updated`}</p>
    </div>
  );
};

export default CCPRealtime;
