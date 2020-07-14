import gql from "graphql-tag";
import { CCPType } from "../queries/collectionPoints";

export enum TriageLevel {
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  RED = "RED",
  BLACK = "BLACK",
  WHITE = "WHITE",
}

export enum Status {
  ON_SITE = "ON_SITE",
  RELEASED = "RELEASED",
  TRANSPORTED = "TRANSPORTED",
  DELETED = "DELETED",
}

export interface Patient {
  id: string;
  gender: string;
  age: number;
  runNumber: number;
  barcodeValue: number;
  collectionPointId: CCPType;
  status: Status;
  triageCategory: number;
  triageLevel: TriageLevel;
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
