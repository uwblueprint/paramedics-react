import gql from "graphql-tag";
import { CCPType } from "../templates/collectionPoints";

export enum triageLevel {
  GREEN,
  YELLOW,
  RED,
  BLACK,
  WHITE,
}

export enum status {
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
  collectionPointId: CCPType;
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
