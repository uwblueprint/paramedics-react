import gql from 'graphql-tag';
import { EventType } from './events';

export interface CollectionPoint {
  id: number;
  name: string;
  eventId: EventType;
}

export const GET_ALL_CCPS = gql`
  query {
    collectionPoints {
      id
      name
      eventId
    }
  }
`;
