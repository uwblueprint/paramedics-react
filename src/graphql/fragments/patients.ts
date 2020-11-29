import gql from 'graphql-tag';

export const SUBSCRIPTION_UPDATE_PATIENT = gql`
fragment NewPatient on Patient {
  gender
  age
  runNumber
  barcodeValue
  triageLevel
  status
  notes
  updatedAt
  transportTime
  hospitalId {
    id
    name
  }
  ambulanceId {
    id
    vehicleNumber
  }
}
`;

export const SUBSCRIPTION_DELETE_PATIENT = gql`
fragment NewPatient on Patient {
  status
  updatedAt
}
`;