import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Quagga from "quagga";

import "../../styles/BarcodeScan.css";

const BarcodeScan = () => {
  const history = useHistory();

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
          readers: ["ean_8_reader"],
        },
      },
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
      }
    );
    Quagga.onDetected((data) => {
      console.log(data);
      const { pathname } = history.location;
      console.log(`${pathname}/manual/${data.codeResult.code}`);
      history.replace(`${pathname}/manual/${data.codeResult.code}`);
    });
  }, []);
  return (
    <div id="barcode-scan">
      <video src=""></video>
    </div>
  );
};

export default BarcodeScan;
