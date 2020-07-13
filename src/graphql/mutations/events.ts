import gql from "graphql-tag";

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
