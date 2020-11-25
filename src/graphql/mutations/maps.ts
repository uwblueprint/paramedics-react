import gql from 'graphql-tag';

export const ADD_PIN = gql`
  mutation addLocationPin(
    $label: String
    $eventId: ID!
    $latitude: Float!
    $longitude: Float!
    $address: String
  ) {
    addLocationPin(
      label: $label
      eventId: $eventId
      latitude: $latitude
      longitude: $longitude
      address: $address
    ) {
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
