import React from 'react';
import { useSubscription } from '@apollo/react-hooks';
import { PATIENTS_SUBSCRIPTION } from '../../graphql/subscriptions/patients';

interface Props {
  collectionPointId: string;
}

export const CCPRealtime = (props: Props) => {
  const { collectionPointId } = props;
  const { data, loading } = useSubscription(PATIENTS_SUBSCRIPTION, {
    variables: { collectionPointId },
  });

  const id: string = data ? data.id : '';

  return (
    <div>
      <p>{loading ? 'Updates Loading...' : id}</p>
    </div>
  );
};

export default CCPRealtime;
