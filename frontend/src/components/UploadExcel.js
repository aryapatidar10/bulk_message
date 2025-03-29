import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./UploadExcel.css"

const UploadExcel = ({ onPhoneNumbersLoaded }) => {
  const [fileName, setFileName] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // Assuming the first sheet contains the phone numbers
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Extract phone numbers from the first column (adjust if needed)
        const phoneNumbers = jsonData.map((row) => row["Phone Number"]); // Adjust column name
        setPhoneNumbers(phoneNumbers); // Store the phone numbers locally
        onPhoneNumbersLoaded(phoneNumbers); // Pass the phone numbers to parent component
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div className="upload-excel">
      <label htmlFor="fileUpload" className="upload-button">
        {fileName ? `File selected: ${fileName}` : "Upload Excel"}
      </label>
      <input
        type="file"
        accept=".xls,.xlsx"
        id="fileUpload"
        className="file-input"
        onChange={handleFileUpload}
        hidden
      />
    </div>
  );
};

export default UploadExcel;
