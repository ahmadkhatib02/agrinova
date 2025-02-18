import plantData from "../../data"
import React from "react"
import Plant from "./Plant";

export default function Homemain () {

    const [plants , setPlants] = React.useState(plantData);

    return (
        <main>
            <Plant  plants = {plantData}/>
            <button> Add Plant </button>
        </main>
        
    )
}