import gql from 'graphql-tag';

export const ADD_USER = gql`
  mutation addUser($name: String!, $email: String!, $password: String!, $accessLevel: accessLevel!, $emergencyContact: String!) {
    addUser(name: $name, email: $email, password: $password, accessLevel: $accessLevel, emergencyContact: $emergencyContact) {
      name
      email
      accessLevel
    }
  }
`;

export const EDIT_USER = gql`
mutation updateUser($id: ID!, $name: String, $email: String, $accessLevel: accessLevel, $emergencyContact: String) {
  updateUser(id: $id, name: $name, email: $email, accessLevel: $accessLevel, emergencyContact: $emergencyContact) {
      id
      name
      email
      accessLevel
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) 
  }
`;