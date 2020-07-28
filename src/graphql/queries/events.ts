import gql from 'graphql-tag';

export interface EventType {
  id: string;
  name: string;
  eventDate: Date;
}

export const FETCH_ALL_EVENTS = gql`
  query {
    events {
      id
      name
      eventDate
    }
  }
`;

export const GET_ALL_EVENTS = gql`
  query {
    events @client {
      id
      name
      eventDate
    }
  }
`;

export const GET_EVENT_BY_ID = (id: string) => gql`
  query {
    event(id: ${id}) {
      id
      name
      eventDate
    }
  }
`;
