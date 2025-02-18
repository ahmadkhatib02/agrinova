import humidity from "../images/humidity 1.png"
import npk from "../images/npk 1.png"
import ph from "../images/ph-balance 1.png"

export default function Plant (props) {
    
    const plantDisplay = props.plants.map(plant =>{
        
        return (
            <div key= {plant.id}>
                <div className="plant-header">
                    <h1 className="plant-name">{plant.name}</h1>
                    <p className={plant.status === "Healthy"? "status-green": ""}>{plant.status}</p>
                </div>

                <p className="timestamp">{plant.timestamp}</p>
                <p className="location">{plant.location}</p>
                <img className="plant-image" src={plant.imageUrl}/>
                
                <div className="metrics">
                    <div className="unit">
                        <img src={humidity}/>
                        <p className="measurements">{plant.metrics.waterLevel}</p>
                    </div>

                    <div className="unit">
                        <img src={ph}/>
                        <p className="measurements down">{plant.metrics.pHLevel}</p>
                    </div>

                    <div className="unit">
                        <img src={npk}/>
                        <p className="measurements">{plant.metrics.waterLevel} {plant.metrics.nutrients.phosphorus} {plant.metrics.nutrients.potassium}</p>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <section> 
            {plantDisplay}
        </section>
    )
}