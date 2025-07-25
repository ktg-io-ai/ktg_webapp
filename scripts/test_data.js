#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const email = process.argv[2];
const name = process.argv[3];

const testData = {
    email: email,
    name: name,
    timestamp: new Date().toISOString()
};

const filePath = path.join(__dirname, '..', 'data', 'test_data.json');

// Check if the file exists
if (!fs.existsSync(filePath)) {
    // Create the file and initialize it with an empty array
    fs.writeFileSync(filePath, '[]', 'utf8');
    console.log('test_data.json created and initialized with an empty array.');
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    let testDatas = [];
    try {
        testDatas = JSON.parse(data);
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return;
    }

    testDatas.push(testData);

    fs.writeFile(filePath, JSON.stringify(testDatas, null, 2), err => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Test data saved to test_data.json');
        }
    });
});
