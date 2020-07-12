import gql from 'graphql-tag';

export const ADD_HOSPITAL = gql`
  mutation addHospital($name: String!) {
    addHospital(name: $name) {
      name
    }
  }
`;

export const EDIT_HOSPITAL = gql`
  mutation updateHospital($id: ID!, $name: String!) {
    updateHospital(id: $id, name: $name) {
      id
      name
    }
  }
`;
