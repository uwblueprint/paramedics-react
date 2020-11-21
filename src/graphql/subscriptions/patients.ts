import gql from 'graphql-tag';

export const PATIENT_UPDATED = gql`
  subscription OnPatientUpdated($collectionPointId: ID!) {
    patientUpdated(collectionPointId: $collectionPointId) {
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

export const PATIENT_DELETED = gql`
  subscription OnPatientDeleted($collectionPointId: ID!) {
    patientDeleted(collectionPointId: $collectionPointId) {
      id
      status
      updatedAt
    }
  }
`;
