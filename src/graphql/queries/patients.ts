import gql from "graphql-tag";
import { CCPType } from "../queries/collectionPoints";

export enum triageLevel {
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  RED = "RED",
  BLACK = "BLACK",
  WHITE = "WHITE",
}

export enum status {
  ON_SITE = "ON_SITE",
  RELEASED = "RELEASED",
  TRANSPORTED = "TRANSPORTED",
  DELETED = "DELETED",
}

export interface PatientType {
  id: string;
  gender: string;
  age: number;
  runNumber: number;
  barcodeValue: number;
  collectionPointId: CCPType;
  status: status;
  triageCategory: number;
  triageLevel: triageLevel;
  notes: string;
  transportTime: Date;
}

export const GET_PATIENT_BY_ID = (id: string) => {
  return gql`
    query {
      patient(id: ${id}) {
        id
        gender
        age
        runNumber
        barcodeValue
        collectionPointId {
          id
          name
          eventId {
            name
            eventDate
          }
        }
        triageLevel
        status
        notes
        transportTime
      }
    }
  `;
};

export const FETCH_ALL_PATIENTS = gql`
  query {
    patients {
      id
      gender
      age
      runNumber
      barcodeValue
      collectionPointId {
        id
        name
        eventId {
          name
          eventDate
        }
      }
      triageLevel
      status
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
      collectionPointId {
        id
        name
        eventId {
          name
          eventDate
        }
      }
      triageLevel
      notes
      transportTime
    }
  }
`;