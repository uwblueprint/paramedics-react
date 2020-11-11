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
      gender
      age
      runNumber
      barcodeValue
      collectionPointId {
        id
        name
        eventId {
          id
          name
          eventDate
        }
      }
      triageLevel
      status
      notes
      updatedAt
      transportTime
      hospitalId {
        id
        name
      }
      ambulanceId {
        id
        vehicleNumber
      }
    }
  }
`;
