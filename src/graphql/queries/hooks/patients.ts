import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useApolloClient } from 'react-apollo';
import { GET_ALL_PATIENTS } from '../patients';
import { CONNECTED } from '../../subscriptions/constants';

export function useAllPatients(eventId?: string, connectionStatus?: string) {
  const { data, refetch } = useQuery(GET_ALL_PATIENTS);
  const client = useApolloClient();

  React.useEffect(() => {
    // fetches from backend when eventId changes
    if (connectionStatus === CONNECTED) refetch();
  }, [eventId, connectionStatus, refetch]);

  if (data) {
    client.writeQuery({
      query: GET_ALL_PATIENTS,
      data: {
        patients: data.patients,
      },
    });
  }
}
