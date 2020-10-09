import gql from 'graphql-tag';

export const ADD_PATIENT = gql`
  mutation addPatient(
    $gender: Gender
    $age: Int
    $runNumber: Int
    $barcodeValue: String!
    $collectionPointId: ID!
    $status: status
    $triageCategory: Int
    $triageLevel: triageLevel!
    $notes: String
    $transportTime: DateTime
    $hospitalId: ID
    $ambulanceId: ID
  ) {
    addPatient(
      gender: $gender
      age: $age
      runNumber: $runNumber
      barcodeValue: $barcodeValue
      collectionPointId: $collectionPointId
      status: $status
      triageCategory: $triageCategory
      triageLevel: $triageLevel
      notes: $notes
      transportTime: $transportTime
      hospitalId: $hospitalId
      ambulanceId: $ambulanceId
    ) {
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

export const EDIT_PATIENT = gql`
  mutation updatePatient(
    $id: ID!
    $gender: Gender
    $age: Int
    $runNumber: Int
    $barcodeValue: String
    $collectionPointId: ID!
    $status: status
    $triageCategory: Int
    $triageLevel: triageLevel
    $notes: String
    $transportTime: DateTime
    $hospitalId: ID
    $ambulanceId: ID
  ) {
    updatePatient(
      id: $id
      gender: $gender
      age: $age
      runNumber: $runNumber
      barcodeValue: $barcodeValue
      collectionPointId: $collectionPointId
      status: $status
      triageCategory: $triageCategory
      triageLevel: $triageLevel
      notes: $notes
      transportTime: $transportTime
      hospitalId: $hospitalId
      ambulanceId: $ambulanceId
    ) {
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

export const DELETE_PATIENT = gql`
  mutation deletePatient($id: ID!) {
    deletePatient(id: $id) {
      id
      collectionPointId {
        id
        eventId {
          id
        }
      }
      status
    }
  }
`;
