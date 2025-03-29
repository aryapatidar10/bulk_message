// backend/index.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// API route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    // You can add code here to read and process the file (Excel)
    if (req.file) {
        res.json({ success: true, file: req.file });
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
