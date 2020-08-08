import gql from 'graphql-tag';

export interface Ambulance {
  id: string;
  vehicleNumber: number;
}

export const GET_ALL_AMBULANCES = gql`
  query {
    ambulances {
      id
      vehicleNumber
    }
  }
`;
