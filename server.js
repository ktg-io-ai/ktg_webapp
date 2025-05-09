const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.post('/register', (req, res) => {
    const { email, name } = req.body;
    const timestamp = new Date().toISOString();

    const testData = {
        email: email,
        name: name,
        timestamp: timestamp
    };

    const filePath = path.join(__dirname, 'data', 'registration.json');

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        // Create the file and initialize it with an empty array
        fs.writeFileSync(filePath, '[]', 'utf8');
        console.log('registration.json created and initialized with an empty array.');
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ status: 'error', message: 'Error reading file' });
        }

        let testDatas = [];
        try {
            testDatas = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).json({ status: 'error', message: 'Error parsing JSON' });
        }

        testDatas.push(testData);

        fs.writeFile(filePath, JSON.stringify(testDatas, null, 2), err => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ status: 'error', message: 'Error writing file' });
            } else {
                console.log('Registration data saved to registration.json');
                return res.json({ status: 'success', message: 'Registration data saved successfully.' });
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
