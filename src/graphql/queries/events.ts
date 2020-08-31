import gql from 'graphql-tag';
import { Ambulance } from './ambulances';
import { Hospital } from './hospitals';

export interface Event {
  id: string;
  name: string;
  eventDate: Date;
  isActive: boolean;
  createdBy: {
    id: string;
  };
  ambulances: Ambulance[];
  hospitals: Hospital[];
}

export const GET_ALL_EVENTS = gql`
  query {
    events {
      id
      name
      eventDate
      isActive
      createdBy {
        id
        name
      }
      ambulances {
        id
        vehicleNumber
      }
      hospitals {
        id
        name
      }
    }
  }
`;

export const GET_EVENT_BY_ID = gql`
  query Event($eventId: ID!) {
    event(id: $eventId) {
      id
      name
      isActive
      eventDate
      ambulances {
        id
        vehicleNumber
      }
      hospitals {
        id
        name
      }
    }
  }
`;
