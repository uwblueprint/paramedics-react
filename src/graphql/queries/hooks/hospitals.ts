import { useQuery } from '@apollo/react-hooks';

import { useApolloClient } from 'react-apollo';
import { GET_ALL_HOSPITALS } from '../hospitals';

const useAllHospitals = (): void => {
    const { data } = useQuery(GET_ALL_HOSPITALS);

    const client = useApolloClient();

    if (data) {
        client.writeQuery({
            query: GET_ALL_HOSPITALS,
            data: {
                hospitals: data.hospitals,
            },
        });
    }
};

export { useAllHospitals };
