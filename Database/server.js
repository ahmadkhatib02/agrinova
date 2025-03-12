const admin = require("firebase-admin");
const serviceAccount = require("../Database/smart-irrigation-system-4b165-firebase-adminsdk-fbsvc-1ac07b94f3.json"); // Replace with your service account key path
const users = require("../Database/db.js"); // Replace with the path to your users data

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-irrigation-system-4b165-default-rtdb.asia-southeast1.firebasedatabase.app/", // Replace with your Realtime Database URL
});

const db = admin.database();

// Function to import users into Realtime Database
async function importUsers() {
  try {
    const ref = db.ref("users"); // Reference to the "users" node in Realtime Database

    // Add each user to the "users" node
    users.forEach((user) => {
      ref.child(user.id.toString()).set(user);
      console.log(`User ${user.firstName} ${user.lastName} imported successfully!`);
    });

    console.log("All users imported successfully!");
  } catch (error) {
    console.error("Error importing users:", error);
  }
}

// Run the import function
importUsers();