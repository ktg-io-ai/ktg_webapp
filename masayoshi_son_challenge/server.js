const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001; // Choose a different port

// Enable CORS for all routes
const corsOptions = {
  origin: 'http://127.0.0.1:2222'
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this line to parse JSON request bodies

app.post('/register', (req, res) => {
    const registrationData = req.body;
    const filePath = path.join(__dirname, 'registrations.json');

    // Read existing registrations
    let registrations = [];
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        registrations = JSON.parse(data);
    } catch (error) {
        console.error('Error reading registrations file:', error);
    }

    // Add the new registration
    registrations.push(registrationData);

    // Write the updated registrations back to the file
    fs.writeFile(filePath, JSON.stringify(registrations, null, 2), err => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ status: 'error', message: 'Error saving registration data.' });
        }

        console.log('Registration data saved to registrations.json');
        res.setHeader('Content-Type', 'application/json');
        res.json({ status: 'success', message: 'Registration data saved successfully.' });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
