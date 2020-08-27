import React from 'react';
import ScanPatientTopBar from './ScanPatientTopBar';
import BarcodeScan from './BarcodeScan';

const ScanPatientPage = ({
  match: {
    params: { ccpId },
  },
}: {
  match: { params: { ccpId: string } };
}) => {
  return (
    <>
      <ScanPatientTopBar />
      <BarcodeScan ccpId={ccpId} />
    </>
  );
};

export default ScanPatientPage;
