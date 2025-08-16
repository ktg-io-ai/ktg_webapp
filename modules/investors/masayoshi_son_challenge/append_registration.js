const fs = require('fs');

const email = process.argv[2];
const name = process.argv[3];
const registrationId = process.argv[4];

const registrationData = {
    email: email,
    name: name,
    registrationId: registrationId,
    timestamp: new Date().toISOString()
};

const filePath = require('path').resolve(__dirname, 'registrations.json');
console.log('filePath (absolute):', filePath);

// Check if the file exists
if (!fs.existsSync(filePath)) {
    // Create the file and initialize it with an empty array
    fs.writeFileSync(filePath, '[]', 'utf8');
    console.log('data/registrations.json created and initialized with an empty array.');
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err, filePath);
        return;
    }

    let registrations = [];
    try {
        registrations = JSON.parse(data);
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return;
    }

    registrations.push(registrationData);

    fs.writeFile(filePath, JSON.stringify(registrations, null, 2), err => {
        if (err) {
            console.error('Error writing file:', err, filePath);
        } else {
            console.log('Registration data saved to registrations.json');
        }
    });
});
