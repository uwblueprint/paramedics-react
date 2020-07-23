import gql from 'graphql-tag';

export const ADD_AMBULANCE = gql`
  mutation addAmbulance($vehicleNumber: Int!) {
    addAmbulance(vehicleNumber: $vehicleNumber) {
      vehicleNumber
    }
  }
`;

export const EDIT_AMBULANCE = gql`
  mutation updateAmbulance($id: ID!, $vehicleNumber: Int!) {
    updateAmbulance(id: $id, vehicleNumber: $vehicleNumber) {
      id
      vehicleNumber
    }
  }
`;

export const DELETE_AMBULANCE = gql`
  mutation deleteAmbulance($id: ID!) {
    deleteAmbulance(id: $id)
  }
`;