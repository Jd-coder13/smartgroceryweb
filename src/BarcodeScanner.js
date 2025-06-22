import React, { useEffect, useRef } from "react";
import Quagga from "quagga";

export default function BarcodeScanner({ onDetected }) {
  const scannerRef = useRef();

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment", // Rear camera
          },
        },
        decoder: {
          readers: ["ean_reader", "upc_reader", "upc_e_reader"],
        },
      },
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((result) => {
      if (result && result.codeResult && result.codeResult.code) {
        onDetected(result.codeResult.code);
        Quagga.stop();
      }
    });

    return () => {
      Quagga.stop();
    };
  }, [onDetected]);

  return (
    <div>
      <div ref={scannerRef} style={{ width: "100%", height: 300 }} />
      <p>Show barcode to camera</p>
    </div>
  );
}
