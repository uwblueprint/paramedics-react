import gql from "graphql-tag";

export const GET_ALL_AMBULANCES = gql`
  query {
    ambulances {
      id
      vehicleNumber
    }
  }
`;
