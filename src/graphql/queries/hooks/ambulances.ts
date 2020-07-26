import { useQuery } from '@apollo/react-hooks';

import { useApolloClient } from 'react-apollo';
import { GET_ALL_AMBULANCES } from '../ambulances';

const useAllAmbulances = (): void => {
  const { data } = useQuery(GET_ALL_AMBULANCES);

  const client = useApolloClient();

  if (data) {
    client.writeQuery({
      query: GET_ALL_AMBULANCES,
      data: {
        hospitals: data.ambulances,
      },
    });
  }
};

export { useAllAmbulances };
