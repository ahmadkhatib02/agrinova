import React from "react"
import { useNavigate } from "react-router-dom"
import { ref, push, set, onValue } from "firebase/database"
import database from "../firebase"
import Footer from "../components/Footer"
import backTrack from "../images/backTrack.png"
import "../styles/AddPlantPage.css"

export default function AddPlantPage({ userID }) {
    const navigate = useNavigate()
    
    const handleForm = (event, userID) => {
        event.preventDefault()
        
        const form = event.target
        const plantName = form.elements["plant-name"].value.trim()
        const plantType = form.elements["plant-type"].value.trim()
        const imageFile = form.elements["plant-image"].files[0]
        
        if (!plantName || !plantType || !imageFile) return
        
        const userPlantsRef = ref(database, `users/${userID}/plants`)
        
        const newPlantRef = push(userPlantsRef)
        
        onValue(userPlantsRef, (snapshot) => {
            const plantsData = snapshot.val() || {}
            const currentPlantsCount = Object.keys(plantsData).length
            
            // Instead of uploading to Firebase Storage, use a local image path
            // For frontend development only
            const fileName = imageFile ? imageFile.name : "default-plant.png"
            const imageUrl = `./src/images/${fileName}`
            
            const newPlant = {
                id: currentPlantsCount + 1,
                name: plantName,
                type: plantType,
                imageUrl: imageUrl,
                metrics: {
                    humidity: "50%", 
                    pHLevel: 7.0,
                    nutrients: {
                        nitrogen: "20%",
                        phosphorus: "10%",
                        potassium: "15%"
                    }
                }
            }
            
            set(newPlantRef, newPlant)
                .then(() => {
                    console.log("Plant added successfully!")
                    form.reset()
                    navigate("/homePage") 
                })
                .catch((error) => {
                    console.error("Error:", error)
                })
        }, { onlyOnce: true }) 
    }

    function goBack() {
        navigate("/homePage")
    }
    
    return (
        <>
            <main>
                <div className="add-plant-container">
                    <form onSubmit={event => handleForm(event, userID)}>
                        <div className="button-group">
                            <button type="button" onClick={goBack} className="cancel-button">
                                <img src={backTrack} alt="go back to homePage" />
                            </button>
                            <h2>Add a New Plant</h2>
                            <button type="submit" className="save-button">
                                Done
                            </button>
                        </div>

                        <div className="container">
                            <div className="form-group">
                                <label htmlFor="plant-name">Plant Name *</label>
                                <input
                                    type="text"
                                    id="plant-name"
                                    name="plant-name"
                                    placeholder="Enter plant name"
                                    className="placeholder"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="plant-type">Plant Type *</label>
                                <select
                                    id="plant-type"
                                    name="plant-type"
                                    required
                                    className="placeholder"
                                >
                                    <option value="">Select plant type</option>
                                    <option value="Potatoes">Potatoes</option>
                                    <option value="Tomatoes">Tomatoes</option>
                                    <option value="Wheat (Spring)">Wheat (Spring)</option>
                                    <option value="Wheat (Winter)">Wheat (Winter)</option>
                                    <option value="Onion (Green)">Onion (Green)</option>
                                    <option value="Onion (Dry)">Onion (Dry)</option>
                                    <option value="Onion (Seed)">Onion (Seed)</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="plant-image">Plant Image *</label>
                                <input
                                    type="file"
                                    id="plant-image"
                                    name="plant-image"
                                    accept="image/*"
                                    required
                                    className="placeholder transparent"
                                />
                            </div>
                        </div>  
                    </form>
                </div>
            </main>
            <Footer  page ="home"/>
        </>
    )
}