
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

export const ADD_EVENT = gql`
  mutation AddTodo($type: String!) {
    addTodo(type: $type) {
      id
      type
    }
  }
`;

