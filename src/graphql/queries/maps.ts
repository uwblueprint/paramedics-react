import gql from 'graphql-tag';
import { Event } from './events';

export interface Pin {
    id: string;
    eventId: Event;
    label: string;
    latitude: number;
    longitude: number;
    address: string;
    createdAt: string;
    updatedAt: string;
}

export const GET_PINS_BY_EVENT_ID = (id: string) => {
    return gql`
    query {
        pinsForEvent(eventId: ${id}) {
            id
            eventId {
                id
                name
                eventDate
            }
            label
            latitude
            longitude
            address
            createdAt
            updatedAt
        }
    }
    `
}