import gql from 'graphql-tag';

export interface Ambulance {
  id: string;
  vehicleNumber: number;
}

export const GET_AMBULANCE_BY_ID = (id: string) => {
  return gql`
      query {
        ambulance(id: ${id}) {
          id
          vehicleNumber
        }
      }
    `;
};

export const GET_ALL_AMBULANCES = gql`
  query {
    ambulances {
      id
      vehicleNumber
    }
  }
`;