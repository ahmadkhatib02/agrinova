import "../../styles/All.css"
import phLvl from "../../images/ph-level.png"
import humidity from "../../images/humidity.png"
import npk from "../../images/npk.png"

export default function All ({plant, idealConditions}){
    return (
        <section className="center">
            <section className="all-container">            
                <section className="type-container"> 
                    <div className="type">
                        <img src={phLvl} alt="ph level" />
                        <h3 className="type-title">PH Level</h3>
                    </div>

                    <div className="values">
                        {idealConditions && (<p>Threshold: {idealConditions.metrics.pHLevel}</p>)}
                        <p>Value: {plant.metrics.pHLevel}</p>
                    </div>
                </section> 

                <section className="type-container">
                    <div className="type">
                        <img src={humidity} alt="humidity" />
                        <h3 className="type-title">Humidity</h3>
                    </div>
                    
                    <div className="values">
                        {idealConditions && (<p>Threshold: {idealConditions.metrics.humidity}%</p>)}
                        <p>Value: {plant.metrics.humidity}</p>
                    </div>
                </section> 

                <section className="type-container">
                    <div className="type"> 
                        <img src={npk} alt="npk levels" />
                        <h3 className="type-title">NPK</h3>
                    </div>
                    
                    <div className="values">
                        <div>
                            <p className="margin-right">Thresholds:</p>
                            {idealConditions && (
                                <div>
                                    <p>Nitrogen: {idealConditions.metrics.nutrients.nitrogen}%</p>
                                    <p>Phosphorus: {idealConditions.metrics.nutrients.phosphorus}%</p>
                                    <p>Potassium: {idealConditions.metrics.nutrients.potassium}%</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="margin-right">Values:</p>
                            <p>Nitrogen: {plant.metrics.nutrients.nitrogen}</p>
                            <p>Phosphorus: {plant.metrics.nutrients.phosphorus}</p>
                            <p>Potassium: {plant.metrics.nutrients.potassium}</p> 
                        </div>
                    </div>
                </section>  
            </section>
        </section>
    )
}

