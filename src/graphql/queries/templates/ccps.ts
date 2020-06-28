import gql from "graphql-tag";

export const GET_ALL_CCPS = gql`
  query {
    collectionPoints {
      id
      name
      eventId {
        id
      }
    }
  }
`;
