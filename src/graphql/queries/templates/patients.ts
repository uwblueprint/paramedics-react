import gql from "graphql-tag";

enum triageLevel {
  GREEN,
  YELLOW,
  RED,
  BLACK,
  WHITE,
}

enum status {
  ON_SITE,
  RELEASED,
  TRANSPORTED,
}

export interface PatientType {
  id: string;
  gender: string;
  age: number;
  runNumber: number;
  barcodeValue: number;
  collectionPointId: number; // We need to make this a collection point type
  status: status;
  triageCategory: number;
  triageLevel: triageLevel;
  notes: string;
  transportTime: Date;
}

export const FETCH_ALL_PATIENTS = gql`
  query {
    patients {
      id
      gender
      age
      runNumber
      barcodeValue
      collectionPointId
      triageLevel
      triageStatus
      notes
      transportTime
    }
  }
`;

export const GET_ALL_PATIENTS = gql`
  query {
    patients @client {
      id
      gender
      age
      barcodeValue
      collectionPointId
      triageLevel
      notes
      transportTime
    }
  }
`;
