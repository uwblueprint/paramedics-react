import { useQuery } from '@apollo/react-hooks';

import { useApolloClient } from 'react-apollo';
import { GET_ALL_USERS } from '../users';

const useAllUsers = (): void => {
  const { data } = useQuery(GET_ALL_USERS);

  const client = useApolloClient();

  if (data) {
    client.writeQuery({
      query: GET_ALL_USERS,
      data: {
        users: data.users,
      },
    });
  }
};

export { useAllUsers };
