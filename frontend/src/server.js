const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());

// Function to send a message using Puppeteer
const sendMessage = async (contact, message) => {
  // Launch Puppeteer with additional options
  const browser = await puppeteer.launch({
    headless: false, // Make sure the browser is visible
    defaultViewport: null, // Use the default viewport size
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Optional: Avoid sandboxing issues
  });

  const page = await browser.newPage();
  
  // Set window size for WhatsApp Web to render properly
  await page.setViewport({ width: 1280, height: 800 });

  // Go to WhatsApp Web
  await page.goto('https://web.whatsapp.com/', { waitUntil: 'load', timeout: 0 }); // No timeout for loading

  console.log('Please scan the QR code.');

  // Wait until the chat list is loaded, indicating that the page is ready after QR scan
  await page.waitForSelector('span[data-testid="chat-list-search"]', { timeout: 0 });  // Wait indefinitely for QR scan

  // Find the contact and click it
  const contactSelector = `span[title="${contact}"]`;
  try {
    await page.click(contactSelector);
  } catch (error) {
    console.error(`Could not find contact: ${contact}`);
    await browser.close();
    throw new Error(`Could not find contact: ${contact}`);
  }

  // Wait for the chat to load
  await page.waitForSelector('div[contenteditable="true"]');

  // Type and send the message
  const messageBox = await page.$('div[contenteditable="true"]');
  await messageBox.type(message);
  await messageBox.press('Enter');

  console.log(`Message sent to ${contact}`);
  await browser.close();
};

// POST endpoint for sending messages
app.post('/sendMessages', async (req, res) => {
  const { phoneNumbers, message } = req.body;
  try {
    for (let number of phoneNumbers) {
      await sendMessage(number, message);
      // Add delay between messages to avoid spam detection (adjust time as needed)
      await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
    }
    res.status(200).send('Messages sent successfully!');
  } catch (error) {
    console.error('Error sending messages:', error);
    res.status(500).send('Error sending messages.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
