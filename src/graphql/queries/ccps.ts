import gql from 'graphql-tag';
import { Event } from './events';

export interface CCP {
  id: string;
  name: string;
  eventId: Event;
}

export const GET_ALL_CCPS = gql`
  query {
    collectionPoints {
      id
      name
      eventId {
        id
      }
    }
  }
`;

export const GET_CCPS_BY_EVENT_ID = gql`
  query collectionPointsByEvent($eventId: ID!) {
    collectionPointsByEvent(eventId: $eventId) {
      id
      name
      eventId {
        id
      }
    }
  }
`;
