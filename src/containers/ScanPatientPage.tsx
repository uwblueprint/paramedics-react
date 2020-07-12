import React from "react";
import "../styles/EventCreationPage.css";
import ScanPatientTopBar from "../components/ScanPatientPage/ScanPatientTopBar";
import BarcodeScan from "../components/ScanPatientPage/BarcodeScan";

const EventCreationPage = () => {
  return (
    <>
      <ScanPatientTopBar />
      <BarcodeScan />
    </>
  );
};

export default EventCreationPage;
