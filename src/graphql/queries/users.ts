import gql from 'graphql-tag';

export enum AccessLevel {
  COMMANDER = 1,
  SUPERVISOR = 2,
  DISPATCH = 3,
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: AccessLevel;
}

export const GET_USER_BY_ID = (id: string) => {
  return gql`
      query {
        user(id: ${id}) {
          id
          name
          email
          roleId
        }
      }
    `;
};

export const GET_ALL_USERS = gql`
  query {
    users {
      id
      name
      email
      roleId
    }
  }
`;

export const GET_LOGGED_IN_USER = gql`
  query {
    loggedInUser {
      id
      name
      email
      roleId
    }
  }
`