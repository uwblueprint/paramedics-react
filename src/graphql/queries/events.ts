import gql from 'graphql-tag';

export interface EventType {
  id: string;
  name: string;
  eventDate: Date;
  // ambulances: Ambulance[];
  // hospitals: Hospital[];
}

export const FETCH_ALL_EVENTS = gql`
  query {
    events {
      id
      name
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

export const GET_ALL_EVENTS = gql`
  query {
    events @client {
      id
      name
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

export const GET_EVENT_BY_ID = gql`
  query Event($eventId: ID!) {
    event(id: $eventId) {
      id
      name
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
