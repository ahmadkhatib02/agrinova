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

Here’s the README documentation you can copy and paste for the **Add Plant Page** component:  

---

# Add Plant Page Component Documentation  

## Overview  
The **Add Plant Page** allows users to add a new plant to their profile by submitting its name, type, and image. Once added, the plant is stored in the Firebase Realtime Database under the user's plant list.  

## Component Features  
- Form-based plant creation with validation for required fields.  
- Dynamically determines the plant's `id` based on the current plant count.  
- Sets default plant metrics (humidity, pH level, and nutrients).  
- Image upload uses a local path reference for frontend development purposes.  
- Navigates back to the home page after successful submission or via a back button.  

## Key Functionalities  

### Form Handling  
- The form requires three fields:  
  - **Plant Name**  
  - **Plant Type** (dropdown selection)  
  - **Plant Image** (local file)  

- On submit, the form data is pushed into Firebase under `users/{userID}/plants`.  

### Plant Object Structure  
Each plant entry added has the following structure:  
- **id**: Incremented based on the current number of plants.  
- **name**: Plant name input by the user.  
- **type**: Plant type selected by the user.  
- **imageUrl**: Local development image path (e.g., `./src/images/filename.png`).  
- **metrics** (default values):  
  - humidity: 50 (float)  
  - pHLevel: 7.0 (float)  
  - nutrients:  
    - nitrogen: 20.0 (float)  
    - phosphorus: 10.0 (float)  
    - potassium: 15.0 (float)  

### Navigation  
- Clicking the **Done** button submits the form and redirects to `/homePage`.  
- Clicking the **Cancel** button (with the back arrow) navigates back to `/homePage` without submission.  

## Props  
- **userID**: The current user's ID, used to determine where in the database to push the new plant.  

## Imported Components  
- `Footer` — Displays the page footer.  

## Styling  
- Styles are managed in `AddPlantPage.css`.  

---

