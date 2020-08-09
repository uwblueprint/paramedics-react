import gql from 'graphql-tag';

export const ADD_EVENT = gql`
  mutation addEvent(
    $name: String!
    $eventDate: Date!
    $createdBy: ID!
    $isActive: Boolean!
  ) {
    addEvent(
      name: $name
      eventDate: $eventDate
      createdBy: $createdBy
      isActive: $isActive
    ) {
      name
      eventDate
    }
  }
`;

export const ADD_HOSPITALS_TO_EVENT = gql`
  mutation addHospitalsToEvent($eventId: ID!, $hospitals: [HospitalInput]!) {
    addHospitalsToEvent(eventId: $eventId, hospitals: $hospitals) {
      id
      hospitals {
        id
      }
    }
  }
`;

export const ADD_AMBULANCES_TO_EVENT = gql`
  mutation addAmbulancesToEvent($eventId: ID!, $ambulances: [AmbulanceInput]!) {
    addAmbulancesToEvent(eventId: $eventId, ambulances: $ambulances) {
      id
      ambulances {
        id
      }
    }
  }
`;

export const DELETE_HOSPITALS_FROM_EVENT = gql`
  mutation deleteHospitalsFromEvent(
    $eventId: ID!
    $hospitals: [HospitalInput]!
  ) {
    deleteHospitalsFromEvent(eventId: $eventId, hospitals: $hospitals) {
      id
      hospitals {
        id
      }
    }
  }
`;

export const DELETE_AMBULANCES_FROM_EVENT = gql`
  mutation deleteAmbulancesFromEvent(
    $eventId: ID!
    $ambulances: [AmbulanceInput]!
  ) {
    deleteAmbulancesFromEvent(eventId: $eventId, ambulances: $ambulances) {
      id
      ambulances {
        id
      }
    }
  }
`;
