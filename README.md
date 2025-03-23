Here’s the final documentation for your database code that you can copy into your README:  

---

# Database Component Documentation  

## Overview  
This database setup contains user profiles and their associated plant data for the smart irrigation system. It is structured to allow storing, uploading, and retrieving user and plant information from Firebase Realtime Database.  

## Data Structure  

### Users Collection  
- **id** (integer)  
- **firstName** (string)  
- **lastName** (string)  
- **email** (string)  
- **password** (string)  
- **profilePicture** (string - image path)  
- **plants** (array of plant objects)  

### Plant Object Structure (inside each user)  
- **id** (integer)  
- **name** (string)  
- **type** (string)  
- **imageUrl** (string - image path)  
- **metrics** (object)  
  - **humidity** (float)  
  - **pHLevel** (float)  
  - **nutrients** (object)  
    - **nitrogen** (float)  
    - **phosphorus** (float)  
    - **potassium** (float)  

---

## Server Import Script Overview  
- The server script uses **Firebase Admin SDK** to upload the user and plant data from `db.js` to the Firebase Realtime Database.  
- It initializes Firebase using a service account JSON key and uses environment variables to access the database URL.  
- The script loops through each user and uploads them under the `users/` reference, with the user ID as a key.  
- Once run, all users and their plant data become available in the Firebase console for use by the smart irrigation system app.  

Here’s a clean, structured README section you can use for the Home Page component:  

---

# Home Page Component Documentation  

## Overview  
The **Home Page** component displays a list of the user's plants fetched from the Firebase Realtime Database. It dynamically shows plant data, allows navigation to add new plants, and includes a header and footer for consistent layout.  

## Component Features  
- Fetches plant data from the database using the provided `userID`.  
- Displays all plants belonging to the user.  
- Shows a conditional message if no plants are available.  
- Displays the total number of plants in the header.  
- Includes an add button to navigate to the add-plant page.  

## Key Functionalities  

### Data Fetching  
- Uses `useEffect` and Firebase’s `onValue` listener to fetch plants under the user's `plants` node.  
- Data is stored in a state variable `plant` as an array.  

### Conditional Rendering  
- If the user has plants, it displays them using the `DisplayPlant` component.  
- If the user has no plants, it displays a message via `DisplayNone`.  

### Navigation  
- The `+` button navigates the user to the Add Plant page using `useNavigate` from `react-router-dom`.  

## Props  
- **userID**: The ID of the currently logged-in user, used to fetch plant data.  

## Imported Components  
- `Header` — Displays the header and plant count.  
- `Footer` — Displays the page footer.  
- `DisplayPlant` — Renders a list of plants.  
- `DisplayNone` — Shown when the user has no plants.  

## Styling  
- Styling for the add button is managed in `AddButton.css`.  

---

