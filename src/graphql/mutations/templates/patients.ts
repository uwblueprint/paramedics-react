import gql from "graphql-tag";

export const ADD_PATIENT = gql`
mutation addPatient(
    $gender: String,
    $age: Int,
    $runNumber: Int,
    $barcodeValue: Int,
    $collectionPointId: ID!,
    $status: status,
    $triageCategory: Int,
    $triageLevel: triageLevel, 
    $notes: String,
    $transportTime: DateTime,
  ): Patient!
  


  mutation addEvent($name: String!, $eventDate: Date!, $createdBy: ID!, $isActive: Boolean!) {
    addEvent(name: $name, eventDate: $eventDate, createdBy: $createdBy, isActive: $isActive) {
      id
      name
      eventDate
      createdBy {
        id
        firstName
      }
      isActive
    }
  }
`;
