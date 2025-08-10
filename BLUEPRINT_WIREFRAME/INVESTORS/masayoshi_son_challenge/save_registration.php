<?php
header('Content-Type: application/json');

$filePath = 'registrations.json';

// Read existing registrations
$registrations = [];
if (file_exists($filePath)) {
    $data = file_get_contents($filePath);
    $registrations = json_decode($data, true);
}

// Get registration data from POST request
$email = $_POST['email'];
$name = $_POST['name'];
$registrationId = $_POST['registrationId'];
$timestamp = date('c'); // ISO 8601 timestamp

$registrationData = [
    'email' => $email,
    'name' => $name,
    'registrationId' => $registrationId,
    'timestamp' => $timestamp
];

// Add the new registration
$registrations[] = $registrationData;

// Write the updated registrations back to the file
$result = file_put_contents($filePath, json_encode($registrations, JSON_PRETTY_PRINT));

if ($result) {
    echo json_encode(['status' => 'success', 'message' => 'Registration data saved successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error saving registration data.']);
}
?>
