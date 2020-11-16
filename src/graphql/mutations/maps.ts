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

export const EDIT_PIN = gql`
  mutation updateLocationPin(
    $id: ID!
    $eventId: ID
    $label: String
    $latitude: Float
    $longitude: Float
    $address: String
  ) {
    updateLocationPin(
      id: $id
      eventId: $eventId
      label: $label
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

export const DELETE_PIN = gql`
  mutation deleteLocationPin($id: ID!) {
    deleteLocationPin(id: $id)
  }
`;
