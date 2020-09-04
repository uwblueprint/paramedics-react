import { useQuery } from '@apollo/react-hooks';
import { useApolloClient } from 'react-apollo';
import { GET_ALL_PATIENTS } from '../patients';

export function useAllPatients() {
  const { data } = useQuery(GET_ALL_PATIENTS);
  const client = useApolloClient();

  if (data) {
    client.writeQuery({
      query: GET_ALL_PATIENTS,
      data: {
        patients: data.patients,
      },
    });
  }
}
