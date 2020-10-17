import gql from 'graphql-tag';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  roleId: number;
  emergencyContact: string;
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
