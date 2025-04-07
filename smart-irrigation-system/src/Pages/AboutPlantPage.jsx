import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import back from "../images/backTrack.png";
import { getDatabase, ref, get } from "firebase/database";
import All from "../components/AboutPlantPage/All";
import "../styles/AboutPlant.css";
import Ph from "../components/AboutPlantPage/Ph";
import Humidity from "../components/AboutPlantPage/Humidity";
import NPK from "../components/AboutPlantPage/NPK";

export default function AboutPlantPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [plant, setPlant] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingThresholds, setLoadingThresholds] = useState(true)
    const [idealConditions, setIdealConditions] = useState(null)
    const [active, setActive] = useState('all')

    const [all, setAll] = useState(1)
    const [ph, setPh] = useState(null)
    const [humidity, setHumidity] = useState(null)
    const [npk, setNpk] = useState(null)


    useEffect(() => {
        if (location.state && location.state.plantObject) {
            setPlant(location.state.plantObject)
            setLoading(false)
            fetchPlantTypeThresholds(location.state.plantObject.type)
        } else {
            console.log("No plant data received in navigation state");
            setLoading(false)
        }
    }, [location, navigate])

    const fetchPlantTypeThresholds = async (plantType) => {
        try {
            setLoadingThresholds(true);
            const db = getDatabase();
            // Use encodeURIComponent to handle special characters in plant type names
            const plantTypeRef = ref(db, `plantTypes/${encodeURIComponent(plantType)}`);
            
            const snapshot = await get(plantTypeRef);
            if (snapshot.exists()) {
                setIdealConditions(snapshot.val());
                console.log("Fetched ideal conditions:", snapshot.val());
            } else {
                console.log("No threshold data found for plant type:", plantType);
            }
        } catch (error) {
            console.error("Error fetching plant type thresholds:", error);
        } finally {
            setLoadingThresholds(false);
        }
    };

    // Render loading state while plant data is being set
    if (loading) {
        return <div>Loading plant data...</div>;
    }

    function toggleButton (event) {
        if(event.currentTarget.dataset.all){
            setAll(1)
            setHumidity(null)
            setNpk(null)
            setPh(null)
            setActive('all')
        }
        if(event.currentTarget.dataset.ph){
            setAll(null)
            setHumidity(null)
            setNpk(null)
            setPh(1)
            setActive('ph')
        }
        if(event.currentTarget.dataset.humidity){
            setAll(null)
            setHumidity(1)
            setNpk(null)
            setPh(null)
            setActive('humidity')
        }
        if(event.currentTarget.dataset.npk){
            setAll(null)
            setHumidity(null)
            setNpk(1)
            setPh(null)
            setActive('npk')
        }
    }

    function isHealthy() {
        if (!plant || !idealConditions) return false
        
        const pHDiff = Math.abs(plant.metrics.pHLevel - idealConditions.metrics.pHLevel)
        const isPHGood = pHDiff <= 0.5
        
        // Handle both string with percentage and numeric values for humidity
        const currentHumidity = typeof plant.metrics.humidity === 'string' 
            ? parseFloat(plant.metrics.humidity.replace('%', ''))
            : plant.metrics.humidity
        
        const idealHumidity = typeof idealConditions.metrics.humidity === 'string'
            ? parseFloat(idealConditions.metrics.humidity.replace('%', ''))
            : idealConditions.metrics.humidity
        
        const humidityDiff = Math.abs(currentHumidity - idealHumidity)
        const isHumidityGood = humidityDiff <= 10
        
        // Handle both string with percentage and numeric values for nutrients
        const currentNitrogen = typeof plant.metrics.nutrients.nitrogen === 'string'
            ? parseFloat(plant.metrics.nutrients.nitrogen.replace('%', ''))
            : plant.metrics.nutrients.nitrogen
        
        const currentPhosphorus = typeof plant.metrics.nutrients.phosphorus === 'string'
            ? parseFloat(plant.metrics.nutrients.phosphorus.replace('%', ''))
            : plant.metrics.nutrients.phosphorus
        
        const currentPotassium = typeof plant.metrics.nutrients.potassium === 'string'
            ? parseFloat(plant.metrics.nutrients.potassium.replace('%', ''))
            : plant.metrics.nutrients.potassium
        
        const idealNitrogen = typeof idealConditions.metrics.nutrients.nitrogen === 'string'
            ? parseFloat(idealConditions.metrics.nutrients.nitrogen.replace('%', ''))
            : idealConditions.metrics.nutrients.nitrogen
        
        const idealPhosphorus = typeof idealConditions.metrics.nutrients.phosphorus === 'string'
            ? parseFloat(idealConditions.metrics.nutrients.phosphorus.replace('%', ''))
            : idealConditions.metrics.nutrients.phosphorus
        
        const idealPotassium = typeof idealConditions.metrics.nutrients.potassium === 'string'
            ? parseFloat(idealConditions.metrics.nutrients.potassium.replace('%', ''))
            : idealConditions.metrics.nutrients.potassium
        
        const isNitrogenGood = currentNitrogen >= idealNitrogen * 0.7
        const isPhosphorusGood = currentPhosphorus >= idealPhosphorus * 0.7
        const isPotassiumGood = currentPotassium >= idealPotassium * 0.7
        
        return isPHGood && isHumidityGood && isNitrogenGood && isPhosphorusGood && isPotassiumGood
    }

    return (
        <>
            <header className="header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <img src={back} alt="go back" />
                </button>
                <h1 className="plantName">{plant.name}</h1>
            </header>
            <main className="all-content">
                <section>
                    {plant.imageUrl && <img src={plant.imageUrl} alt={plant.name}  className="image"/>}
                    <div className="intro-container">
                        <h1 className="main-name">{plant.name}</h1>
                        <p className={isHealthy()? "Healthy": "Unhealthy"}>{isHealthy()? "Healthy": "Unhealthy"}</p>
                    </div>
                    <h2 className="plant-type">Plant Type: {plant.type}</h2>
                </section>

                <section className="button-container">
                    <button onClick={toggleButton} data-all="true" className={`tab-about  ${active==='all'&& "selected"}`}>All</button>
                    <button onClick={toggleButton} data-ph="true" className={`tab-about  ${active==='ph'&& "selected"}`}>PH Level</button>
                    <button onClick={toggleButton} data-humidity="true" className={`tab-about  ${active==='humidity'&& "selected"}`}>Humidity</button>
                    <button onClick={toggleButton} data-npk="true" className={`tab-about  ${active==='npk'&& "selected"}`}>NPK</button>
                </section>
                
                <section>
                    {all && (
                        <All plant = {plant} idealConditions = {idealConditions}/>
                    )}

                    {ph &&(
                        <Ph plant= {plant} idealConditions={idealConditions}/>
                    )}

                    {humidity&& (
                        <Humidity plant={plant} idealConditions={idealConditions}/>
                    )}

                    {npk && (
                        <NPK plant={plant} idealConditions={idealConditions}/>
                    )}
                    
                </section>       
            </main>
            <Footer  page ="home"/>
        </>
    );
}