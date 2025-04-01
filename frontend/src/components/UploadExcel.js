import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./UploadExcel.css"

const UploadExcel = ({ onPhoneNumbersLoaded }) => {
  const [fileName, setFileName] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(xls|xlsx)$/)) {
      setStatus("error");
      setErrorMessage("Please upload a valid Excel file (.xls or .xlsx)");
      return;
    }

    setFileName(file.name);
    setStatus("loading");

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          // Extract phone numbers from the first column
          const phoneNumbers = jsonData.map((row) => row["Phone Number"]).filter(Boolean);
          
          if (phoneNumbers.length === 0) {
            throw new Error("No phone numbers found in the Excel file");
          }

          setPhoneNumbers(phoneNumbers);
          onPhoneNumbersLoaded(phoneNumbers);
          setStatus("success");
        } catch (error) {
          setStatus("error");
          setErrorMessage(error.message || "Error processing the Excel file");
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      setStatus("error");
      setErrorMessage("Error reading the file");
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "loading":
        return "Processing...";
      case "success":
        return `File processed: ${fileName}`;
      case "error":
        return errorMessage || "Upload Failed";
      default:
        return fileName ? `File selected: ${fileName}` : "Upload Excel";
    }
  };

  return (
    <div className="upload-excel">
      <label
        htmlFor="fileUpload"
        className={`upload-button ${status}`}
        data-has-file={!!fileName}
      >
        {getButtonText()}
      </label>
      <input
        type="file"
        accept=".xls,.xlsx"
        id="fileUpload"
        className="file-input"
        onChange={handleFileUpload}
        disabled={status === "loading"}
      />
    </div>
  );
};

export default UploadExcel;
