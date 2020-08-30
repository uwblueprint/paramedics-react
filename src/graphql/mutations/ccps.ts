import gql from 'graphql-tag';

export const DELETE_CCP = gql`
  mutation deleteCollectionPoint($id: ID!) {
    deleteCollectionPoint(id: $id)
  }
`;

export const ADD_CCP = gql`
  mutation addCollectionPoint($name: String!, $eventId: ID!, $createdBy: ID!) {
    addCollectionPoint(name: $name, eventId: $eventId, createdBy: $createdBy) {
      id
      name
      eventId {
        id
        name
        eventDate
      }
    }
  }
`;

export const EDIT_CCP = gql`
  mutation updateCollectionPoint(
    $id: ID!
    $name: String
    $eventId: ID
    $createdBy: ID
  ) {
    updateCollectionPoint(
      id: $id
      name: $name
      eventId: $eventId
      createdBy: $createdBy
    ) {
      id
      name
      eventId {
        id
        name
        eventDate
      }
    }
  }
`;
