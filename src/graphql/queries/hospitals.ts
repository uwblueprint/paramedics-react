import gql from 'graphql-tag';
export interface Hospital {
  id: string;
  name: string;
}

export const GET_HOSPITAL_BY_ID = (id: string) => {
  return gql`
      query {
        hospital(id: ${id}) {
          id
          name
        }
      }
    `;
};

export const GET_ALL_HOSPITALS = gql`
  query {
    hospitals {
      id
      name
    }
  }
`;
