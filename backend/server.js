const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const cors = require('cors'); // Import CORS
const xlsx = require('xlsx'); 

const app = express();
const port = 3001;

// Use CORS middleware to allow requests from different origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

const sendMessages = async (phoneNumbers, message) => {
  try {
    console.log("Launching Puppeteer...");

    // Launch Puppeteer browser instance
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log("Navigating to WhatsApp Web...");
    await page.goto('https://web.whatsapp.com', { waitUntil: 'domcontentloaded' });

    try {
      // Wait for WhatsApp Web to load and display the chat list search bar
      await page.waitForSelector('div[data-testid="chat-list-search"]', { visible: true, timeout: 60000 }); // Increased timeout
      console.log("WhatsApp loaded successfully.");
    } catch (error) {
      console.error("Error loading WhatsApp Web:", error);
      await browser.close();
      return;
    }

    for (let i = 0; i < phoneNumbers.length; i++) {
      const phoneNumber = phoneNumbers[i];
      const encodedMessage = encodeURIComponent(message);
      console.log(`Sending message to ${phoneNumber}...`);

      try {
        // Navigate to the WhatsApp send page for the phone number
        await page.goto(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`, { waitUntil: 'domcontentloaded' });

        // Wait for the message input field to appear
        await page.waitForSelector('div[contenteditable="true"]', { visible: true, timeout: 10000 });

        // Type the message in the input box
        await page.type('div[contenteditable="true"]', message);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);  // Wait for a while before sending the next message
        console.log(`Message sent to: ${phoneNumber}`);
      } catch (error) {
        console.error(`Error sending message to ${phoneNumber}:`, error);
      }
    }

    console.log("Closing Puppeteer...");
    await browser.close();
  } catch (error) {
    console.error('Error sending messages:', error);
  }
};

// POST route to send messages
app.post('/sendMessages', async (req, res) => {
  const { phoneNumbers, message } = req.body;

  // Validate the request body
  if (!phoneNumbers || !message || phoneNumbers.length === 0) {
    return res.status(400).send({ error: "Phone numbers or message not provided" });
  }

  try {
    await sendMessages(phoneNumbers, message);  // Call sendMessages function with the provided phone numbers and message
    res.status(200).send({ message: 'Messages sent successfully!' });
  } catch (error) {
    console.error("Error while sending message:", error);
    res.status(500).send({ error: 'Failed to send messages' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
