import gql from 'graphql-tag';

const ADD_CCP = gql`
  mutation addCollectionPoint($name: String!, $eventId: ID!, $createdBy: ID) {
    addCollectionPoint(
      name: $name
      eventtId: $eventDate
      createdBy: $createdBy
    ) {
      id
      name
      eventId
    }
  }
`;

export default ADD_CCP;
