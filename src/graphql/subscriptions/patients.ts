import gql from 'graphql-tag';

export const PATIENTS_SUBSCRIPTION = gql`
  subscription OnPatientUpdated($collectionPointId: ID!) {
    patientUpdated(collectionPointId: $collectionPointId) {
      id
    }
  }
`;
