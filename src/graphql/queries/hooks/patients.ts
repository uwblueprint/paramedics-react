import { useQuery } from "@apollo/react-hooks";
import { useApolloClient } from "react-apollo";
import { FETCH_ALL_PATIENTS } from "../patients";

export function useAllPatients() {
  const { data } = useQuery(FETCH_ALL_PATIENTS);
  const client = useApolloClient();

  if (data) {
    client.writeQuery({
      query: FETCH_ALL_PATIENTS,
      data: {
        patients: data.patients,
      },
    });
  }
}
