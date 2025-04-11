// Create a file called export-data.js
const fs = require('fs');
const users = require('../Database/users.js');
const plantTypes = require('../Database/plantTypes.js');

// Combine data into a single object if you want everything in one file
const exportData = {
  users: {},
  plantTypes: {}
};

// Format users by ID
users.forEach(user => {
  exportData.users[user.id] = user;
});

// Format plant types by type
plantTypes.forEach(plant => {
  const safeKey = encodeURIComponent(plant.type).replace(/\./g, '%2E');
  exportData.plantTypes[safeKey] = plant;
});

// Write to JSON file
fs.writeFileSync('firebase-data.json', JSON.stringify(exportData, null, 2));

console.log('Data exported to firebase-data.json successfully!');