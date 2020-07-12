import gql from 'graphql-tag';

export const ADD_USER = gql`
  mutation addUser($firstName: String!, $lastName: String!, $email: String!, $password: String!, $accessLevel: accessLevel!, $emergencyContact: String!) {
    addUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password, accessLevel: $accessLevel, emergencyContact: $emergencyContact) {
      firstName
      lastName
      email
      accessLevel
    }
  }
`;

export const EDIT_USER = gql`
mutation updateUser($id: ID!, $firstName: String, $lastName: String, $email: String, $accessLevel: accessLevel, $emergencyContact: String) {
  updateUser(id: $id, firstName: $firstName, lastName: $lastName, email: $email, accessLevel: $accessLevel, emergencyContact: $emergencyContact) {
      id
      firstName
      lastName
      email
      accessLevel
    }
  }
`;