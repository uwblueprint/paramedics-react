import React from 'react';
import ScanPatientTopBar from './ScanPatientTopBar';
import BarcodeScan from './BarcodeScan';

const ScanPatientPage = ({
  match: {
    params: { ccpID },
  },
}: {
  match: { params: { ccpID: string } };
}) => {
  return (
    <>
      <ScanPatientTopBar />
      <BarcodeScan ccpID={ccpID} />
    </>
  );
};

export default ScanPatientPage;
