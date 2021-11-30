import gql from 'graphql-tag';
export interface Hospital {
  id: string;
  name: string;
}

export const GET_HOSPITAL_BY_ID = gql`
      query hospital($id: ID!) {
        hospital(id: $id) {
          id
          name
        }
      }`;

export const GET_ALL_HOSPITALS = gql`
  query {
    hospitals {
      id
      name
    }
  }
`;
