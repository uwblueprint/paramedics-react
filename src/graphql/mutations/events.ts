import gql from 'graphql-tag';

export const ADD_EVENT = gql`
  mutation addEvent(
    $name: String!
    $eventDate: Date!
    $createdBy: ID!
    $isActive: Boolean!
  ) {
    addEvent(
      name: $name
      eventDate: $eventDate
      createdBy: $createdBy
      isActive: $isActive
    ) {
      name
      eventDate
    }
  }
`;

export const EDIT_EVENT = gql`
  mutation updateEvent(
    $id: ID!
    $name: String!
    $eventDate: Date!
    $createdBy: ID!
    $isActive: Boolean!
  ) {
    updateEvent(
      id: $id
      name: $name
      eventDate: $eventDate
      createdBy: $createdBy
      isActive: $isActive
    ) {
      name
      eventDate
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation deleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`;
