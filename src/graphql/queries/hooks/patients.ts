import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useApolloClient } from 'react-apollo';
import { GET_ALL_PATIENTS } from '../patients';

export function useAllPatients(eventId?: string, connectionData?: string) {
  const { data, refetch } = useQuery(GET_ALL_PATIENTS);
  const client = useApolloClient();

  React.useEffect(() => {
    // fetches from backend when eventId changes
    if (connectionData === 'connected') refetch();
  }, [eventId]);

  if (data) {
    client.writeQuery({
      query: GET_ALL_PATIENTS,
      data: {
        patients: data.patients,
      },
    });
  }
}
