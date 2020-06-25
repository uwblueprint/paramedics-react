import { useQuery } from "@apollo/react-hooks";

import { FETCH_ALL_PATIENTS } from "../templates/patients";
import { useApolloClient } from "react-apollo";

export function useAllPatients() {
  const { data } = useQuery(FETCH_ALL_PATIENTS);
  const client = useApolloClient();

  if (data) {
    client.writeQuery({
      query: FETCH_ALL_PATIENTS,
      data: {
        events: data.events,
      },
    });
  }
}
