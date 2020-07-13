import { useQuery } from '@apollo/react-hooks';

import { useApolloClient } from 'react-apollo';
import { FETCH_ALL_EVENTS } from '../templates/events';

const useAllEvents = (): void => {
  const { data } = useQuery(FETCH_ALL_EVENTS);
  const client = useApolloClient();

  if (data) {
    client.writeQuery({
      query: FETCH_ALL_EVENTS,
      data: {
        events: data.events,
      },
    });
  }
};

export default useAllEvents;
