import gql from 'graphql-tag';
import { Event } from './events';

export interface LocationPin {
  id: string;
  eventId: Event;
  label: string;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export const GET_PINS_BY_EVENT_ID = gql`
  query pinsForEvent($eventId: ID!) {
    pinsForEvent(eventId: $eventId) {
      id
      eventId {
        id
        name
        createdAt
      }
      label
      latitude
      longitude
      address
    }
  }
`;
