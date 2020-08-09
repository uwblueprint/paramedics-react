import gql from 'graphql-tag';
import { EventType } from './events';

export interface CCP {
  id: string;
  name: string;
  eventId: EventType;
}

export const GET_CCP_BY_ID = gql`

  query collectionPoint($id: ID!) {
    collectionPoint(id: $id) {
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

export const GET_ALL_CCPS = gql`
  query {
    collectionPoints {
      id
      name
      eventId {
        name
        eventDate 
      }
    }
  }
`;
