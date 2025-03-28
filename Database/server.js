require("dotenv").config({ path: "../Database/.env" });
const admin = require("firebase-admin");
const serviceAccount = require("../Database/smart-irrigation-system-4b165-firebase-adminsdk-fbsvc-08ca202860.json");
const users = require("../Database/users.js");
const plantTypes = require("../Database/plantTypes.js"); // Import the plant types data

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.REACT_APP_DATABASE_URL,
});

const db = admin.database();

// Function to import users into Realtime Database
async function importUsers() {
  try {
    const ref = db.ref("users");
    
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

// Function to import plant types into Realtime Database
async function importPlantTypes() {
  try {
    const ref = db.ref("plantTypes"); // Reference to the "plantTypes" node
    
    // Create a promise array to track all the set operations
    const promises = [];
    
    // Add each plant type to the "plantTypes" node
    plantTypes.forEach((plant, index) => {
      // Create a safe key by encoding or replacing special characters
      const safeKey = encodeURIComponent(plant.type).replace(/\./g, '%2E');
      
      // Create a promise for each set operation
      const promise = ref.child(safeKey).set(plant)
        .then(() => {
          console.log(`Plant type ${plant.type} imported successfully!`);
        })
        .catch((err) => {
          console.error(`Failed to import ${plant.type}:`, err);
          throw err; // Re-throw to be caught by Promise.all
        });
      
      promises.push(promise);
    });
    
    // Wait for all promises to resolve
    await Promise.all(promises);
    
    // Double-check that the data was written
    const snapshot = await ref.once('value');
    const data = snapshot.val();
    
    if (data) {
      console.log("Verification: Plant types data structure:", 
                  Object.keys(data).length, "entries found");
      console.log("All plant types imported successfully!");
    } else {
      console.error("Verification failed: No plant types data found in database after import");
    }
  } catch (error) {
    console.error("Error importing plant types:", error);
  }
}

// Run the import functions
async function importAllData() {
  try {
    // Check if we can connect to the database
    console.log("Testing database connection...");
    const testRef = db.ref(".info/connected");
    const connectedSnapshot = await testRef.once('value');
    
    if (connectedSnapshot.val() === true) {
      console.log("Successfully connected to Firebase Realtime Database");
    } else {
      console.log("Warning: Not connected to Firebase Realtime Database");
      // Continue anyway as the connection might still work for writes
    }
    
    // Try importing the data
    await importUsers();
    await importPlantTypes();
    
    // Final verification
    console.log("\nFinal verification:");
    const plantTypesRef = db.ref("plantTypes");
    const snapshot = await plantTypesRef.once('value');
    const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
    
    console.log(`Verification complete: ${count} plant types found in database.`);
    console.log("Database import completed!");
  } catch (error) {
    console.error("Error during import process:", error);
  } finally {
    // Always exit the process when done
    process.exit(0);
  }
}

// Give Firebase some time to initialize before starting imports
setTimeout(() => {
  console.log("Starting database import...");
  importAllData();
}, 1000);