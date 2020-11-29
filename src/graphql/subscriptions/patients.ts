import gql from 'graphql-tag';

export const PATIENT_UPDATED = gql`
  subscription onPatientUpdated($eventId: ID!) {
    patientUpdated(eventId: $eventId) {
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
  subscription onPatientAdded($eventId: ID!) {
    patientAdded(eventId: $eventId) {
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
  subscription onPatientDeleted($eventId: ID!) {
    patientDeleted(eventId: $eventId) {
      id
      status
      updatedAt
    }
  }
`;
