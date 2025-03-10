"# smart-irrigation-system"

# HomePage Component Documentation

## Overview
The `HomePage` component is the main page of the application. It displays a list of plants and includes a button (currently without functionality) to add new plants. It also includes a header and footer.

## Functions & Features

### 1. **useState (React Hook)**
const [plant, setPlant] = React.useState([...plantData]); //useState is a React Hook used to manage state in functional components. It initializes the plant state with data from plantData. //The setPlant function is used to update the plant state.

#### 2. **Header Component**
<Header number={plant.length} /> // This component displays the header of the page. It receives number as a prop, representing the total number of plants.

### 3. **Conditional Rendering (Ternary Operator)**
{plant.length === 0 ? <DisplayNone /> : <DisplayPlant plant={plant} />}
If there are no plants (plant.length === 0), it renders the DisplayNone component. // Prompts the user to create plants if no plants found. Otherwise, it renders DisplayPlant, passing the plant array as a prop.

### 4. **Button Element**
<button className="add">+</button> A button with the class "add" is to add a new plant when clicked using an event handler.

### 5. **Footer Component**
<Footer /> //This component displays the footer of the page.

### 6. **Imports Used**

import React from "react";

import Header from "../components/Header"; // a code design of the header by importing the logo and array size display of number of plants.

import "../styles/AddButton.css"; 

import Footer from "../components/Footer"; a code design of the footer by importing account and plants icons

import plantData from "../../data"; // seperate file to collect real-time data of sensors // still trial numbers for now

import DisplayNone from "../components/HomePage/DisplayNone";

import DisplayPlant from "../components/HomePage/DisplayPlant";

React: Required for using React features like hooks.  // It is like a library that is used for making the buttons reactive.
Header, Footer, DisplayNone, DisplayPlant: Custom components used in the HomePage.
plantData: Imported plant data (assumed to be an array).
../styles/AddButton.css: CSS file for styling the button.
