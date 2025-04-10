import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ref, push, set, onValue, get } from "firebase/database"
import  {database} from "../firebase" 
import { useAuth } from "../contexts/AuthContext" 
import Footer from "../components/Footer"
import backTrack from "../images/backTrack.png"
import "../styles/AddPlantPage.css"

export default function AddPlantPage() {
    const navigate = useNavigate()
    const [plantTypeOptions, setPlantTypeOptions] = useState([])
    const [loading, setLoading] = useState(false)
    const { currentUser } = useAuth() // Get current authenticated user
    
    useEffect(() => {
        const plantTypesRef = ref(database, 'plantTypes')
        
        get(plantTypesRef).then((snapshot) => {
            if (snapshot.exists()) {
                const plantTypesData = snapshot.val()
                // Convert object to array if needed
                const plantTypesArray = Array.isArray(plantTypesData) 
                    ? plantTypesData 
                    : Object.values(plantTypesData)
                
                setPlantTypeOptions(plantTypesArray)
            } else {
                console.log("No plant types found in database")
                setPlantTypeOptions([])
            }
        }).catch((error) => {
            console.error("Error fetching plant types:", error)
        })
    }, [])
    
    const handleForm = (event) => {
        event.preventDefault()
        
        if (!currentUser || !currentUser.id) {
            console.error("User not authenticated")
            return
        }
        
        setLoading(true)
        
        const form = event.target
        const plantName = form.elements["plant-name"].value.trim()
        const plantType = form.elements["plant-type"].value.trim()
        const imageFile = form.elements["plant-image"].files[0]
        
        if (!plantName || !plantType || !imageFile) {
            setLoading(false)
            return
        }
        
        const userPlantsRef = ref(database, `users/${currentUser.id}/plants`)
        
        const newPlantRef = push(userPlantsRef)
        
        onValue(userPlantsRef, (snapshot) => {
            const plantsData = snapshot.val() || {}
            const currentPlantsCount = Object.keys(plantsData).length
            
            const fileName = imageFile ? imageFile.name : "default-plant.png"
            const imageUrl = `./src/images/${fileName}`
            
            const selectedPlantType = plantTypeOptions.find(plant => plant.type === plantType)
            
            let metrics = {}
            
            // Ensure consistent format with string percentages
            if (selectedPlantType && selectedPlantType.metrics) {
                const originalMetrics = selectedPlantType.metrics
                metrics = {
                    // Convert any numeric humidity to string with percentage
                    humidity: typeof originalMetrics.humidity === 'number' 
                        ? `${originalMetrics.humidity}%` 
                        : originalMetrics.humidity,
                    pHLevel: originalMetrics.pHLevel,
                    nutrients: {
                        // Convert any numeric nutrients to strings with percentages
                        nitrogen: typeof originalMetrics.nutrients.nitrogen === 'number'
                            ? `${originalMetrics.nutrients.nitrogen}%`
                            : originalMetrics.nutrients.nitrogen,
                        phosphorus: typeof originalMetrics.nutrients.phosphorus === 'number'
                            ? `${originalMetrics.nutrients.phosphorus}%`
                            : originalMetrics.nutrients.phosphorus,
                        potassium: typeof originalMetrics.nutrients.potassium === 'number'
                            ? `${originalMetrics.nutrients.potassium}%`
                            : originalMetrics.nutrients.potassium
                    }
                }
            } else {
                // Default metrics as strings with percentage symbols
                metrics = {
                    humidity: "50%",
                    pHLevel: 7.0,
                    nutrients: {
                        nitrogen: "20%",
                        phosphorus: "10%",
                        potassium: "15%"
                    }
                }
            }
            
            const newPlant = {
                id: currentPlantsCount + 1,
                name: plantName,
                type: plantType,
                imageUrl: imageUrl,
                metrics: metrics
            }
            
            set(newPlantRef, newPlant)
                .then(() => {
                    console.log("Plant added successfully!")
                    form.reset()
                    setLoading(false)
                    navigate("/homePage") 
                })
                .catch((error) => {
                    console.error("Error:", error)
                    setLoading(false)
                })
        }, { onlyOnce: true }) 
    }

    function goBack() {
        navigate("/homePage")
    }
    
    const DisplayOptions = () => {
        return plantTypeOptions.map((plant, index) => (
            <option key={index} value={plant.type}>
                {plant.type}
            </option>
        ))
    }
    
    // Show loading state if user data is not yet loaded
    if (!currentUser) {
        return <div className="loading">Loading...</div>
    }
    
    return (
        <>
            <main>
                <div className="add-plant-container">
                    <form onSubmit={handleForm}>
                        <div className="button-group">
                            <button 
                                type="button" 
                                onClick={goBack} 
                                className="cancel-button"
                                disabled={loading}
                            >
                                <img src={backTrack} alt="go back to homePage" />
                            </button>
                            <h2>Add a New Plant</h2>
                            <button 
                                type="submit" 
                                className="save-button"
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Done"}
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
                                    disabled={loading}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="plant-type">Plant Type *</label>
                                <select
                                    id="plant-type"
                                    name="plant-type"
                                    required
                                    className="placeholder"
                                    disabled={loading}
                                >
                                    <option value="">Select plant type</option>
                                    <DisplayOptions />
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
                                    disabled={loading}
                                />
                            </div>
                        </div>  
                    </form>
                </div>
            </main>
            <Footer page="home"/>
        </>
    )
}