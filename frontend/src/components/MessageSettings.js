import React, { useState } from "react";
import "./MessageSettings.css";

const MessageSettings = ({ onTimeGapChange }) => {
  const [timeGapSeconds, setTimeGapSeconds] = useState(1); // Default: 1 second
  const [error, setError] = useState(""); // Error message state
  const [isChecked, setIsChecked] = useState({
    attachments: false,
    unsubscribe: false,
    personalizedMessage: false,
    timeStamp: false,
  });

  const handleTimeGapChange = (event) => {
    const value = event.target.value;
    const timeGap = Number(value);
    if (timeGap >= 1 && Number.isInteger(timeGap)) {
      setTimeGapSeconds(timeGap);
      setError(""); // Clear error message
      onTimeGapChange(timeGap * 1000); // Convert seconds to milliseconds
    } else {
      setError("Please enter a valid positive integer greater than or equal to 1.");
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setIsChecked((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="message-settings">
      <h4>Message Settings</h4>
      
      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            name="attachments"
            checked={isChecked.attachments}
            onChange={handleCheckboxChange}
          />
          Send Attachments
        </label>
        <label>
          <input
            type="checkbox"
            name="unsubscribe"
            checked={isChecked.unsubscribe}
            onChange={handleCheckboxChange}
          />
          Add Option to Unsubscribe
        </label>
        <label>
          <input
            type="checkbox"
            name="personalizedMessage"
            checked={isChecked.personalizedMessage}
            onChange={handleCheckboxChange}
          />
          Send Personalized Message
        </label>
        <label>
          <input
            type="checkbox"
            name="timeStamp"
            checked={isChecked.timeStamp}
            onChange={handleCheckboxChange}
          />
          Add Time Stamp
        </label>
      </div>
      
      <div>
        <label>
          Time Gap (seconds):{" "}
          <input
            type="number"
            value={timeGapSeconds}
            onChange={handleTimeGapChange}
            min="1" // Minimum gap: 1 second
            step="1"
            aria-describedby="timeGapTooltip"
          />
        </label>
        <div id="timeGapTooltip" className="tooltip">
          (Time gap in seconds)
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>

      <button disabled={timeGapSeconds < 1 || isChecked.attachments || isChecked.unsubscribe}>
        Save Settings
      </button>
    </div>
  );
};

export default MessageSettings;
