
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import React from "react";
import plantData from "../../data";

export default function HomePage (){
    const [plant , setPlant] = React.useState(plantData)
    function DisplayNone(){
        return (
            <article>
                <img src="" alt="Main Logo" />
                <h1>You Have No Plants</h1>
                <h2>You haven't added any plants yet.</h2>
            </article> 
        )
    }
    function DisplayPlant (){
        
        return(
            <h1>HELLO</h1>
        )
    }
    return (
        <>
        <Header  number = {plant.length}/>
        <main>
            {plant.length === 0 ? <DisplayNone/> : <DisplayPlant/>}
            <button>+</button>
        </main>
        
        <Footer />
        </>
    )
}