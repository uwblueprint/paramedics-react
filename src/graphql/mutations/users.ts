import gql from 'graphql-tag';

export const ADD_USER = gql`
  mutation addUser($name: String!, $email: String!, $roleId: ID!) {
    addUser(name: $name, email: $email, roleId: $roleId) {
      id
      name
      email
      roleId
    }
  }
`;

export const EDIT_USER = gql`
  mutation updateUser($id: ID!, $name: String, $email: String, $roleId: ID) {
    updateUser(id: $id, name: $name, email: $email, roleId: $roleId) {
      id
      name
      email
      roleId
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
