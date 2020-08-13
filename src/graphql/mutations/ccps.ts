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
        id
        name
        eventDate 
      }
    }
  }
`;

const EDIT_CCP = gql`

  mutation updateCollectionPoint( 
    $id: ID!
    $name: String
    $eventId: ID
    $createdBy: ID) {
      updateCollectionPoint(
        id: $id
        name: $name
        eventId: $eventId
        createdBy: $createdBy
      ) {
        id
        name
        eventId {
          id
          name
          eventDate 
        }

      }


    }


`;

export { ADD_CCP, EDIT_CCP };
