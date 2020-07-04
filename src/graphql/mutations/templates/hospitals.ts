import gql from 'graphql-tag';

export const ADD_HOSPITAL = gql`
  mutation addHospital($name: String!) {
    addHospital(name: $name) {
      name
    }
  }
`;
