import gql from "graphql-tag";

export const GET_ALL_HOSPITALS = gql`
  query {
    hospitals {
      id
      name
    }
  }
`;
