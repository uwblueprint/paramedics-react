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
}

export const FETCH_ALL_PATIENTS = gql`
  query {
    patients {
      id
      collectionPointId {
        id
      }
      triageLevel
      status
      barcodeValue
      gender
      age
      transportTime
    }
  }
`;

export const GET_ALL_PATIENTS = gql`
  query {
    patients @client {
      id
      collectionPointId {
        id
      }
      triageLevel
      status
      barcodeValue
      gender
      age
      transportTime
    }
  }
`;
