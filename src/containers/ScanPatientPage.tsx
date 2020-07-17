import React from "react";
import "../styles/EventCreationPage.css";
import ScanPatientTopBar from "../components/ScanPatientPage/ScanPatientTopBar";
import BarcodeScan from "../components/ScanPatientPage/BarcodeScan";

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
