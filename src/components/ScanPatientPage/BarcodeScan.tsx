import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Quagga from "quagga";
import { useQuery } from "react-apollo";
import { FETCH_ALL_PATIENTS } from "../../graphql/queries/patients";

const BarcodeScan = ({
  eventID,
  ccpID,
}: {
  eventID: string;
  ccpID: string;
}) => {
  const history = useHistory();
  const { data, loading } = useQuery(FETCH_ALL_PATIENTS);
  const [barcode, setBarcode] = useState<string>("");

  useEffect(() => {
    if (!loading && barcode !== "") {
      const selectedPatient = data.patients.filter(
        (patient) => patient.barcodeValue.toString() === barcode
      );

      if (selectedPatient.length > 0) {
        // Found patient
        const {
          collectionPointId: { id: patientCCPId },
          id,
        } = selectedPatient[0];
        // Redirect to patient profile
        history.replace(`/patients/edit/${patientCCPId}/${id}`);
      } else {
        // No existing patient
        history.replace(`/patients/new/${ccpID}`);
      }
    }
  }, [barcode]);

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#barcode-scan"),
          constraints: {
            width: window.innerWidth,
            height: window.innerHeight,
            facing: "environment", // or user
          },
        },
        decoder: {
          readers: ["code_128_reader"],
        },
      },
      function (err) {
        if (err) {
          console.log(err);
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
  }, []);
  return (
    <div id="barcode-scan">
      {/* Hardcoded styles to make barcode scan full screen */}
      <video src="" style={{ width: "100%", height: "auto" }}></video>
      <video
        src=""
        className="drawingBuffer"
        style={{ display: "none" }}
      ></video>
      <canvas className="drawingBuffer" style={{ display: "none" }}></canvas>
    </div>
  );
};

export default BarcodeScan;
