import gql from 'graphql-tag';

export const DELETE_CCP = gql`
  mutation deleteCollectionPoint($id: ID!) {
    deleteCollectionPoint(id: $id)
  }
`;
