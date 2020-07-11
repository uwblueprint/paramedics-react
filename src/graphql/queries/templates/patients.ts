import gql from "graphql-tag";
import { CollectionPoint } from "./ccp";

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
  collectionPointId: CollectionPoint;
  triageLevel: TriageLevel;
  status: Status;
  barcodeValue: number;
  gender: string;
  age: number;
  transportTime: Date;
  runNumber: number;
  notes: string;
}

export const FETCH_ALL_PATIENTS = gql`
  query {
    patients {
      id
      collectionPointId {
        id
        name
      }
      triageLevel
      status
      barcodeValue
      gender
      age
      transportTime
      runNumber
      notes
    }
  }
`;

export const GET_ALL_PATIENTS = gql`
  query {
    patients @client {
      id
      collectionPointId {
        id
        name
      }
      triageLevel
      status
      barcodeValue
      gender
      age
      transportTime
      runNumber
      notes
    }
  }
`;
