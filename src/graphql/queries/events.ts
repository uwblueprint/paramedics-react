import gql from 'graphql-tag';

export interface EventType {
  id: string;
  name: string;
  eventDate: Date;
  isActive: boolean;
  createdBy: {
    id: string;
  };
}

export const FETCH_ALL_EVENTS = gql`
  query {
    events {
      id
      name
      eventDate
      isActive
      createdBy {
        id
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
      isActive
      createdBy {
        id
      }
    }
  }
`;

export const GET_EVENT_BY_ID = (id: string) => gql`
  query {
    event(id: ${id}) {
      id
      name
      eventDate
      isActive
      createdBy {
        id
      }
    }
  }
`;
