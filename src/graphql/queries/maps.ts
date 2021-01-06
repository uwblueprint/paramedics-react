import gql from 'graphql-tag';
import { Event } from './events';
import { CCP } from './ccps';

export enum PinType {
  EVENT = 'EVENT',
  CCP = 'CCP',
  OTHER = 'OTHER',
}

export enum MapTypes {
  ROADMAP = 'roadmap',
  HYBRID = 'hybrid',
}

export enum MapModes {
  Map = 'map',
  NewEvent = 'newEvent',
  NewCCP = 'newCCP',
  EditEvent = 'editEvent',
  EditCCP = 'editCCP',
}

export interface LocationPin {
  id: string;
  eventId: Event;
  label: string;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: string;
  updatedAt: string;
  pinType: PinType;
  ccpId: CCP;
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
      pinType
      ccpId {
        id
        name
      }
    }
  }
`;

export const GET_ALL_PINS = gql`
  query {
    pins {
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
      pinType
      ccpId {
        id
        name
      }
    }
  }
`;
