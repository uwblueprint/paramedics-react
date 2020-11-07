import gql from 'graphql-tag';

export const PATIENT_UPDATED = gql`
  subscription OnPatientUpdated($collectionPointId: ID!) {
    patientUpdated(collectionPointId: $collectionPointId) {
      id
    }
  }
`;

export const PATIENT_ADDED = gql`
  subscription OnPatientAdded($collectionPointId: ID!) {
    patientAdded(collectionPointId: $collectionPointId) {
      id
    }
  }
`;
