import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Quagga from 'quagga';
import { useQuery } from 'react-apollo';
import { GET_ALL_PATIENTS } from '../../graphql/queries/patients';

const BarcodeScan = ({
  eventId,
  ccpId,
}: {
  eventId: string;
  ccpId: string;
}) => {
  const history = useHistory();
  const { data, loading, error } = useQuery(GET_ALL_PATIENTS);
  const [barcode, setBarcode] = useState<string>('');

  useEffect(() => {
    if (!loading && barcode !== '' && !error) {
      const selectedPatient = data.patients.filter(
        (patient) =>
          patient.barcodeValue && patient.barcodeValue.toString() === barcode
      );

      if (selectedPatient.length > 0) {
        // Found patient
        const {
          collectionPointId: {
            id: patientCCPId,
            eventId: { id: patientEventId },
          },
          id,
        } = selectedPatient[0];
        // Redirect to patient profile
        history.replace(
          `/events/${patientEventId}/ccps/${patientCCPId}/patients/${id}`
        );
      } else {
        // No existing patient
        history.replace(
          `/events/${eventId}/ccps/${ccpId}/patients/new/${barcode}`
        );
      }
    }
  }, [barcode]);

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.querySelector('#barcode-scan'),
          constraints: {
            width: window.innerWidth,
            height: window.innerHeight,
            facing: 'environment', // or user
          },
        },
        decoder: {
          readers: ['code_128_reader'],
        },
      },
      (err: boolean) => {
        if (err) {
          // TODO: add error handling;
          return;
        }
        Quagga.start();
      }
    );
    Quagga.onDetected((data) => {
      // Check if barcode already exists
      const { code } = data.codeResult;
      setBarcode(code);
    });
    return () => {
      Quagga.offDetected();
      Quagga.stop();
    };
  }, []);
  return (
    /*eslint-disable */
    <div id="barcode-scan">
      {/* Hardcoded styles to make barcode scan full screen */}
      <video src="" style={{ width: '100%', height: 'auto' }} />
      <video src="" className="drawingBuffer" style={{ display: 'none' }} />
      <canvas className="drawingBuffer" style={{ display: 'none' }} />
    </div>
    /* eslint-enable */
  );
};

export default BarcodeScan;