import "../../styles/DisplayPlant.css"
import button from "../../images/button.png"

function DisplayPlant (props){

    function handleClick(event){
        if(event.currentTarget.dataset.check){
            checkPlant(event.currentTarget.dataset.check);
        }
    }
    
    function checkPlant (plantId){
        plantId = Number(plantId)
        const plantObject = props.plant.filter(plant =>{
            return plant.id === plantId
        })[0]; 
    }

    const display = props.plant.map(plant => {
        return (
            <section key={plant.id} data-check ={plant.id} onClick={handleClick}>
              <img src={plant.imageUrl} alt={plant.name +" image"} /> 

              <div className="info">
                <h1 className="plant-name typography">{plant.name}</h1>
                <p className="plant-type typography noAdded">{plant.type}</p>
              </div> 
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