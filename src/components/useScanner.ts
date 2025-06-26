import { useEffect } from "react";

interface ScannerOptions {
  onAccessionScan: (accessionNo: string) => void;
  prefix?: string; // Expected scanner prefix
}

export const useScanner = ({
  onAccessionScan,
  prefix = "%", // Default prefix, configure your scanner to send this
}: ScannerOptions) => {
  useEffect(() => {
    let scannedData = "";
    let isScanning = false;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === prefix) {
        scannedData = "";
        isScanning = true;
        return;
      }

      if (isScanning) {
        if (e.key === "Enter") {
          processScannedData(scannedData);
          scannedData = "";
          isScanning = false;
        } else {
          scannedData += e.key;
        }
      }
    };

    const processScannedData = (data: string) => {
      const cleanedData = data.trim();
      if (cleanedData) {
        onAccessionScan(cleanedData);
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [onAccessionScan, prefix]);
};
