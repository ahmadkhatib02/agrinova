// src/Pages/HomePage.jsx
import Header from "../components/Header";
import "../styles/AddButton.css";
import Footer from "../components/Footer";
import React, { useState, useEffect } from "react";
import DisplayNone from "../components/HomePage/DisplayNone";
import DisplayPlant from "../components/HomePage/DisplayPlant";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function HomePage() {
  // State to hold plant data
  const [plant, setPlant] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      setLoading(false);
      return;
    }
    
    const userPlantsRef = ref(database, `users/${currentUser.id}/plants`);
    
    const unsubscribe = onValue(userPlantsRef, (snapshot) => {
      const plantsData = snapshot.val();
      if (plantsData) {
        // Convert the object into an array
        const plantArray = Object.keys(plantsData).map((key) => ({
          id: key,
          ...plantsData[key],
        }));
        setPlant(plantArray);
      } else {
        setPlant([]);
      }
      setLoading(false);
    });
    
    // Clean up listener on component unmount
    return () => unsubscribe();
  }, [currentUser]);
  
  function handleAddPlantClick() {
    navigate("/add-plant");
  }
  
  if (loading) {
    return <div className="loading">Loading your plants...</div>;
  }
  
  return (
    <>
      <Header 
        number={plant.length} 
        page= "home"
      />
      
      <main>
        {/* Conditional rendering: Show plant list or 'No plants' message */}
        {plant.length === 0 ? <DisplayNone /> : <DisplayPlant plant={plant} />}
        
        {/* Button to add a new plant */}
        <button className="add" onClick={handleAddPlantClick}>+</button>
      </main>
      
      <Footer page="home" />
    </>
  );
}