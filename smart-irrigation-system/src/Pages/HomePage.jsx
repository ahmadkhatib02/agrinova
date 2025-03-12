
import Header from "../components/Header";
import "../styles/AddButton.css";
import Footer from "../components/Footer";
import React from "react";
import plantData from "../../data";
import DisplayNone from "../components/HomePage/DisplayNone";
import DisplayPlant from "../components/HomePage/DisplayPlant";

export default function HomePage (){
    // State to hold plant data
    const [plant , setPlant] = React.useState([...plantData]) 
    return (
        <>
        {/* Header with plant count */}
        <Header  number = {plant.length}/>
        <main>
            {/* Conditional rendering: Show plant list or 'No plants' message */}
            {plant.length === 0 ? <DisplayNone/> : <DisplayPlant plant ={plant}/>}
            {/* Button to add a new plant */}
            <button className="add">+</button>
        </main>
        
        <Footer />
        </>
    )
}