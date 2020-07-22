import React from "react";
import ScanPatientTopBar from "./ScanPatientTopBar";
import BarcodeScan from "./BarcodeScan";

const ScanPatientPage = ({
  match: {
    params: { eventID, ccpID },
  },
}: {
  match: { params: { eventID: string; ccpID: string } };
}) => {
  return (
    <>
      <ScanPatientTopBar />
      <BarcodeScan eventID={eventID} ccpID={ccpID} />
    </>
  );
};

export default ScanPatientPage;
