import React from 'react';
import ScanPatientTopBar from './ScanPatientTopBar';
import BarcodeScan from './BarcodeScan';

const ScanPatientPage = ({
  match: {
    params: { eventId, ccpId },
  },
}: {
  match: { params: { eventId: string; ccpId: string } };
}) => {
  return (
    <>
      <ScanPatientTopBar />
      <BarcodeScan eventId={eventId} ccpId={ccpId} />
    </>
  );
};

export default ScanPatientPage;
