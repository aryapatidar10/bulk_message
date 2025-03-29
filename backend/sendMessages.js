const puppeteer = require('puppeteer');

const sendMessages = async (phoneNumbers, message) => {
  try {
    // Launch Puppeteer browser with visible window (headless: false)
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Go to WhatsApp Web
    await page.goto('https://web.whatsapp.com');
    
    // Wait for the QR code to appear and allow manual scanning
    console.log('Scan the QR code in the opened browser...');
    await page.waitForSelector('div[data-testid="chat-list-search"]', { visible: true });

    for (let i = 0; i < phoneNumbers.length; i++) {
      const phoneNumber = phoneNumbers[i];
      const encodedMessage = encodeURIComponent(message); // URL-encode the message

      // Open the chat with the provided phone number
      await page.goto(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`);

      // Wait until the message input box is visible
      await page.waitForSelector('div[contenteditable="true"]', { visible: true });

      // Type the message and send it
      await page.type('div[contenteditable="true"]', message);
      await page.keyboard.press('Enter'); // Press "Enter" to send the message

      console.log(`Message sent to: ${phoneNumber}`);

      // Wait for a small delay before sending the next message (1 second here)
      await page.waitForTimeout(1000);  // Adjust delay as necessary
    }

    console.log('All messages sent successfully!');
    await browser.close(); // Close the browser after sending messages
  } catch (error) {
    console.error('Error sending messages:', error); // Log any errors that occur
  }
};

module.exports = sendMessages;
