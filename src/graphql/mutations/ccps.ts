import gql from 'graphql-tag';

const ADD_CCP = gql`
  mutation addCollectionPoint($name: String!, $eventId: ID!, $createdBy: ID!) {
    addCollectionPoint(
      name: $name
      eventId: $eventId
      createdBy: $createdBy
    ) {
      id
      name
      eventId {
        name
        eventDate 
      }
    }
  }
`;

export default ADD_CCP;
