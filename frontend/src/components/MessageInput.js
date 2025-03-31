import React, { useState } from "react";
import "../App.css"; // Assuming you import the updated CSS
import "./MessageInput.css"

const MessageInput = ({ timeGap, phoneNumbers }) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  // Function to send messages
  const sendMessages = async () => {
    if (phoneNumbers.length === 0) {
      setErrorMessage("No phone numbers available. Please upload a valid Excel file.");
      setStatus("error");
      return;
    }

    if (message.trim() === "") {
      setErrorMessage("Please enter a message to send.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      // URL-encode the message
      const encodedMessage = encodeURIComponent(message);

      // Loop through the phone numbers
      for (let i = 0; i < phoneNumbers.length; i++) {
        const phoneNumber = phoneNumbers[i];
        
        // Validate the phone number and check if it's a non-empty string
        if (phoneNumber && typeof phoneNumber === 'string' && phoneNumber.trim() !== "") {
          // Remove any non-digit characters from the phone number
          const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');
          
          if (formattedPhoneNumber.length >= 10) {
            // Wait for the specified time gap
            await new Promise(resolve => setTimeout(resolve, timeGap));
            
            const whatsappURL = `https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`;
            const newWindow = window.open(whatsappURL, "_blank");
            
            if (!newWindow) {
              throw new Error("Please allow popups for this website.");
            }
            
            newWindow.focus();
          } else {
            console.log(`Invalid phone number: ${phoneNumber}`);
          }
        } else {
          console.log(`Skipping invalid phone number: ${phoneNumber}`);
        }
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      setErrorMessage(error.message || "An error occurred while sending messages.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "loading":
        return "Sending Messages...";
      case "success":
        return "Messages Sent!";
      case "error":
        return errorMessage || "Error Sending Messages";
      default:
        return "Send Messages";
    }
  };

  return (
    <div className="container">
      <div className="message-input">
        <textarea
          placeholder="Enter your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-box"
          disabled={status === "loading"}
        />
        <button 
          onClick={sendMessages} 
          className={`send-button ${status}`}
          disabled={status === "loading"}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
