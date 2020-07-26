import gql from 'graphql-tag';

export const ADD_PATIENT = gql`
  mutation addPatient(
    $gender: String
    $age: Int
    $runNumber: Int
    $barcodeValue: Int!
    $collectionPointId: ID!
    $status: status
    $triageCategory: Int
    $triageLevel: triageLevel!
    $notes: String
    $transportTime: DateTime,
    $hospitalId: ID
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
        }
      }
      triageLevel
      status
      notes
      transportTime
      hospitalId {
        id
        name
      }
    }
  }
`;

export const EDIT_PATIENT = gql`
  mutation updatePatient(
    $id: ID!
    $gender: String
    $age: Int
    $runNumber: Int
    $barcodeValue: Int
    $collectionPointId: ID!
    $status: status
    $triageCategory: Int
    $triageLevel: triageLevel
    $notes: String
    $transportTime: DateTime
    $hospitalId: ID
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
        }
      }
      triageLevel
      status
      notes
      transportTime
      hospitalId {
        id
        name
      }
    }
  }
`;
