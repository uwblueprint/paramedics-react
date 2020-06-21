import gql from "graphql-tag";

export interface EventType {
  name: string;
  eventDate: Date;
}

export const FETCH_ALL_EVENTS = gql`
  query {
    events {
      name
      eventDate
    }
  }
`;

export const GET_ALL_EVENTS = gql`
  query {
    events @client {
      name
      eventDate
    }
  }
`;

export const GET_EVENT_INFO = gql`
  query Event($eventId: ID!) {
    event(id: $eventId){
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
