import gql from 'graphql-tag';
import { CCP } from './ccps';
import { Hospital } from './hospitals';

export enum TriageLevel {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED',
  BLACK = 'BLACK',
  WHITE = 'WHITE',
}

export enum Status {
  ON_SITE = 'ON_SITE',
  RELEASED = 'RELEASED',
  TRANSPORTED = 'TRANSPORTED',
  DELETED = 'DELETED',
}

export interface Patient {
  id: string;
  gender: string;
  age: number;
  runNumber: number;
  barcodeValue: string;
  collectionPointId: CCP;
  status: Status;
  triageCategory: number;
  triageLevel: TriageLevel;
  notes: string;
  transportTime?: Date;
  updatedAt: Date;
  hospitalId: Hospital;
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
            id
            name
            eventDate
          }
        }
        triageLevel
        status
        notes
        updatedAt
        transportTime
        hospitalId {
          id
          name
        }
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
          id
          name
          eventDate
        }
      }
      triageLevel
      status
      notes
      updatedAt
      transportTime
      hospitalId {
        id
        name
      }
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
          id
          name
          eventDate
        }
      }
      triageLevel
      notes
      updatedAt
      transportTime
      hospitalId {
        id
        name
      }
    }
  }
`;
