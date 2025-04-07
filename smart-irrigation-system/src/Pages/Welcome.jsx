// CSS stylesheet
import "../styles/WelcomePage.css"
import phone from "../images/welcome-page.png"
import { useNavigate } from "react-router-dom"



//Import your components here (make sure that they are saved in components folder)

export default function Welcome () {
    const navigate = useNavigate()

    function startApp (){
        navigate("/homePage")
    }

    return (
        <main>
            <div className="landing-photo">
                <div>
                    <h1 className="phone">Agrinova</h1>
                    <h2 className="phone">For a Better Style</h2>
                </div>  
            </div>

            <div>
                <h1 className="title">Smart Irrigation for a Thriving Garden!</h1>
                <p className="description">Automate watering, track soil moisture, and keep your plants healthy with real-time monitoring.</p>
            </div>
            <button className="start" onClick={startApp}>Get Started</button>
        </main>
    )
}