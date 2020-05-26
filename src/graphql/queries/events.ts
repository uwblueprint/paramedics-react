import gql from "graphql-tag";

export const FETCH_ALL_EVENTS = gql`
  query {
    users {
      id
      accessLevel
      firstName
      lastName
      email
      emergencyContact
      createdAt
      updatedAt
    }
  }
`;
