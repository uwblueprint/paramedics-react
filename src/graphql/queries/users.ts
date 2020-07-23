import gql from "graphql-tag";

export enum accessLevel {
  COMMANDER = "COMMANDER",
  SUPERVISOR = "SUPERVISOR",
  ADMIN = "ADMIN",
}

export interface UserType {
  id: string;
  name: string;
  email: string;
  password: string;
  accessLevel: accessLevel;
  emergencyContact: string;
}

export const GET_USER_BY_ID = (id: string) => {
  return gql`
      query {
        user(id: ${id}) {
          id
          name
          email
          accessLevel
        }
      }
    `;
};

export const GET_ALL_USERS = gql`
  query {
    users {
      id
      firstName
      email
      accessLevel
    }
  }
`;

