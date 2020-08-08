import gql from 'graphql-tag';

export interface Hospital {
  id: string;
  name: string;
}

export const GET_ALL_HOSPITALS = gql`
  query {
    hospitals {
      id
      name
    }
  }
`;
