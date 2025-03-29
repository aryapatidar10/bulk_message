import React, { useState } from "react";
import "../App.css"; // Assuming you import the updated CSS
import "./MessageInput.css"

const MessageInput = ({ timeGap, phoneNumbers }) => {
  const [message, setMessage] = useState("");

  // Function to send messages
  const sendMessages = () => {
    if (phoneNumbers.length === 0) {
      alert("No phone numbers available. Please upload a valid Excel file.");
      return;
    }

    if (message.trim() === "") {
      alert("Please enter a message to send.");
      return;
    }

    // URL-encode the message
    const encodedMessage = encodeURIComponent(message);

    // Loop through the phone numbers
    phoneNumbers.forEach((phoneNumber, index) => {
      // Validate the phone number and check if it's a non-empty string
      if (phoneNumber && typeof phoneNumber === 'string' && phoneNumber.trim() !== "") {
        // Remove any non-digit characters from the phone number
        const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');
        
        if (formattedPhoneNumber.length >= 10) { // Validate phone number length
          setTimeout(() => {
            const whatsappURL = `https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`;
            const newWindow = window.open(whatsappURL, "_blank"); // Open WhatsApp Web link in a new tab
            if (newWindow) {
              newWindow.focus(); // Ensure the new window gets focus
            } else {
              alert("Please allow popups for this website.");
            }
          }, timeGap * index); // Apply the time gap between sending messages
        } else {
          console.log(`Invalid phone number: ${phoneNumber}`);
        }
      } else {
        console.log(`Skipping invalid phone number: ${phoneNumber}`);
      }
    });
  };

  return (
    <div className="container">
      <div className="message-input">
        <textarea
          placeholder="Enter your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-box"
        />
        <button onClick={sendMessages} className="send-button">
          Send Messages
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
