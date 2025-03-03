// CSS stylesheet
import "../styles/WelcomePage.css"



//Import your components here (make sure that they are saved in components folder)

export default function Welcome () {
    return (
        <main>
            <div >
                <img  src={plant}/>
            </div>

            <div>
                <h1>Smart Irrigation for a Thriving Garden!</h1>
                <p>Automate watering, track soil moisture, and keep your plants healthy with real-time monitoring.</p>
            </div>
        </main>
    )
}