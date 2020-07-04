import gql from 'graphql-tag';

export const ADD_USER = gql`
  mutation addUser($firstName: String!, $lastName: String!, $email: String!,  $password: String!, $accessLevel: String!, $emergencyContact: String!) {
    addUser(firstName: $firstName, lastName: $lastName, email: $email,  password: $password, accessLevel: $accessLevel, emergencyContact: $emergencyContact) {
      firstName
      lastName
      email
      accessLevel
    }
  }
`;
