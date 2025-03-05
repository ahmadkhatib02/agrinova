
import Header from "../components/Header";
import "../styles/AddButton.css";
import Footer from "../components/Footer";
import React from "react";
import plantData from "../../data";
import DisplayNone from "../components/HomePage/DisplayNone";
import DisplayPlant from "../components/HomePage/DisplayPlant";

export default function HomePage (){
    const [plant , setPlant] = React.useState([...plantData]) 
    return (
        <>
        <Header  number = {plant.length}/>
        <main>
            {plant.length === 0 ? <DisplayNone/> : <DisplayPlant plant ={plant}/>}
            <button className="add">+</button>
        </main>
        
        <Footer />
        </>
    )
}