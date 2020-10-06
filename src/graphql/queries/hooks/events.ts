import { useQuery } from '@apollo/react-hooks';

import { useApolloClient } from 'react-apollo';
import { GET_ALL_EVENTS } from '../events';

const useAllEvents = (): void => {
  const { data } = useQuery(GET_ALL_EVENTS);
  const client = useApolloClient();

  if (data) {
    client.writeQuery({
      query: GET_ALL_EVENTS,
      data: {
        events: data.events,
      },
    });
  }
};

export default useAllEvents;
