import { useMutation } from "@apollo/react-hooks";
import { ADD_PATIENT } from "../templates/patients";
import { CCPType } from "../../queries/templates/collectionPoints";
import { triageLevel, status } from "../../queries/templates/patients";

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
  const [addPatient, { data }] = useMutation(ADD_PATIENT);

  if (complete) {
    addPatient({
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
