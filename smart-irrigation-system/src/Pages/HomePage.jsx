import Header from "../components/Header";
import "../styles/AddButton.css";
import Footer from "../components/Footer";
import React from "react";
import DisplayNone from "../components/HomePage/DisplayNone";
import DisplayPlant from "../components/HomePage/DisplayPlant";
import { ref, onValue } from "firebase/database";
import database from "../firebase";

export default function HomePage ({userID}){
    // State to hold plant data
    const [plant , setPlant] = React.useState([]) 
    React.useEffect(() => {
        const userPlantsRef = ref(database, `users/${userID}/plants`)
        onValue(userPlantsRef, (snapshot) => {
          const plantsData = snapshot.val();
          if (plantsData) {
            // Convert the object into an array
            const plantArray = Object.keys(plantsData).map((key) => ({
              id: key,
              ...plantsData[key],
            }))
            setPlant(plantArray)
          } else {
            setPlant([])
          }
        });
      }, [userID])

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