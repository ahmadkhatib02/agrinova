import "../../styles/DisplayPlant.css"
import button from "../../images/button.png"
import { useNavigate } from "react-router-dom";

function DisplayPlant (props){
    const navigate = useNavigate()
    
    // Handles click event to check plant details
    function handleClick(event){
        if(event.currentTarget.dataset.check){
            checkPlant(event.currentTarget.dataset.check);
        }
    }
    
    // Retrieves plant object based on ID
    function checkPlant (plantId){
        plantId = Number(plantId)
        const plantObject = props.plant.filter(plant =>{
            return plant.id === plantId
        })[0];
        navigate("/about-plant", {
            state: {plantObject: plantObject}
        })
    }
    
    // Maps through plant data and displays each plant
    const display = props.plant.map(plant => {
        // Use either imageData (base64) or fall back to imageUrl if it exists
        const imageSrc = plant.imageData || plant.imageUrl || "";
        
        return (
            <section key={plant.id} data-check ={plant.id} onClick={handleClick} className="plant-container">
              <img src={imageSrc} alt={plant.name +" image"} className="plant-photo" />
              <div className="info">
                <h1 className="plant-name typography">{plant.name}</h1>
                <p className="plant-type typography noAdded">{plant.type}</p>
              </div>
              {/* Button to check plant status */}
              <img className="position-button" src={button} alt= {`Check ${plant.name}`} />
            </section>
        )
    })
   
    return(
        <>
         {display}
        </>    
    )
}

export default DisplayPlant;