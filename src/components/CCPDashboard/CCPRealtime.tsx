import React, { useState } from 'react';
import { useSubscription } from '@apollo/react-hooks';
import { PATIENTS_SUBSCRIPTION } from '../../graphql/subscriptions/patients';

interface Props {
  collectionPointId: string;
}

export const CCPRealtime = (props: Props) => {
  const [numUpdates, setNumUpdates] = useState(0);
  const [listUpdates, setListUpdates] = useState([]);
  const { collectionPointId } = props;
  const { data, loading } = useSubscription(PATIENTS_SUBSCRIPTION, {
    variables: { collectionPointId },
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      setNumUpdates(numUpdates + 1);
      //setListUpdates([...listUpdates, data]);
    },
  });

  const id: string = data ? data.patientUpdated.id : '';

  return (
    <div>
      <p>new updates: {numUpdates}</p>
      <p>{loading ? '' : 'patient ' + id + ' updated'}</p>
    </div>
  );
};

export default CCPRealtime;
