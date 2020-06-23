import { useMutation } from "@apollo/react-hooks";
import { ADD_PATIENT } from "../templates/patients";
import {
  CCPType,
  triageLevel,
  status,
} from "../../queries/templates/collectionPoints";

export function usePatientMutation(
  {
    gender,
    age,
    runNumber,
    barcodeValue,
    collectionPointId,
    status,
    triageCategory,
    triageLevel,
    notes,
    transportTime,
  }: {
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
  },
  complete: boolean,
  setComplete: (val: boolean) => any
) {
  const [addEvent, { data }] = useMutation(ADD_PATIENT);

  if (complete) {
    addEvent({
      variables: {
        gender,
        age,
        runNumber,
        barcodeValue,
        collectionPointId,
        status,
        triageCategory,
        triageLevel,
        notes,
        transportTime,
      },
    });
    setComplete(false);
  }
}
