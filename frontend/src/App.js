import React, { useState } from "react";
import axios from "axios";
import MessageInput from "./components/MessageInput";
import MessageSettings from "./components/MessageSettings";
import UploadExcel from "./components/UploadExcel";
import Navbar from "./components/Navbar"; // Import Navbar
import "./components/Navbar.css";

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

  const sendMessages = async () => {
    if (numbers.length === 0) {
      setError("No phone numbers loaded.");
      return;
    }

    setError("");
    const message = "Your bulk message here!";

    for (let i = 0; i < numbers.length; i++) {
      try {
        const response = await axios.post("http://localhost:3001/sendMessages", {
          phoneNumbers: [numbers[i]],
          message,
        });

        if (response.status === 200) {
          console.log(`✅ Message sent to: ${numbers[i]}`);
        } else {
          console.error(`❌ Failed to send message to ${numbers[i]}`);
        }
      } catch (err) {
        console.error("❌ Error:", err);
        setError(`Error sending message: ${err.message}`);
      }

      if (i < numbers.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, timeGap));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar Component */}
      <Navbar />

      <div className="main-content flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            📩 Bulk Messaging App
          </h1>

          <UploadExcel onPhoneNumbersLoaded={handleNumbersLoaded} />
          <MessageSettings onTimeGapChange={handleTimeGapChange} />
          <MessageInput timeGap={timeGap} phoneNumbers={numbers} />

          <p className="text-gray-600 mt-4">
            <strong>📌 Loaded:</strong> {messageSentCount} numbers
          </p>

          {error && <p className="text-red-500 font-medium mt-2">{error}</p>}

          <button
            onClick={sendMessages}
            className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 w-full"
          >
            🚀 Send Messages
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
