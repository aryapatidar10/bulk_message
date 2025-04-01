import React, { useState } from "react";
import MessageInput from "./components/MessageInput";
import MessageSettings from "./components/MessageSettings";
import UploadExcel from "./components/UploadExcel";
import Navbar from "./components/Navbar";
import "./App.css";

const App = () => {
  const [numbers, setNumbers] = useState([]);
  const [timeGap, setTimeGap] = useState(1000);
  const [messageSentCount, setMessageSentCount] = useState(0);
  const [error, setError] = useState("");

  const handleNumbersLoaded = (loadedNumbers) => {
    setNumbers(loadedNumbers);
    setMessageSentCount(loadedNumbers.length);
  };

  const handleTimeGapChange = (newTimeGap) => {
    setTimeGap(newTimeGap);
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="main-card">
          <h1 className="title">Bulk Messaging</h1>

          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-icon">📱</span>
              <span className="stat-text">
                {messageSentCount} Numbers
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⏱️</span>
              <span className="stat-text">
                {timeGap / 1000}s Gap
              </span>
            </div>
          </div>

          <UploadExcel onPhoneNumbersLoaded={handleNumbersLoaded} />
          <MessageSettings onTimeGapChange={handleTimeGapChange} />
          <MessageInput timeGap={timeGap} phoneNumbers={numbers} />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
