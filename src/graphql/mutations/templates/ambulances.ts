import gql from 'graphql-tag';

export const ADD_AMBULANCE = gql`
  mutation addAmbulance($vehicleNumber: Int!) {
    addAmbulance(vehicleNumber: $vehicleNumber) {
        vehicleNumber
    }
  }
`;
