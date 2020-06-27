import { useMutation } from "@apollo/react-hooks";
import { ADD_PATIENT, EDIT_PATIENT } from "../templates/patients";
import { CCPType } from "../../queries/templates/collectionPoints";
import { triageLevel, status } from "../../queries/templates/patients";

export function addPatientMutation(
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

export function editPatientMutation({
  id,
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
}) {
  const [editPatient, { data }] = useMutation(EDIT_PATIENT);
  editPatient({
    variables: {
      id,
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
}
