// CSS stylesheet
import "../styles/WelcomePage.css"
import { useState } from "react"
import mainLogo from "../images/Main Logo.png"
import google from "../images/google.png"



//Import your components here (make sure that they are saved in components folder)

export default function Welcome () {
    const [start , setStart] = useState("welcome")

    function startApp (){
        setStart("begin")
    }

    return (
        <main>
            {start === "welcome" && 
                <>
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
                </>
            }

            {start === "begin" &&
                <>
                    <img className="logo" src={mainLogo} alt="Main Logo" />
                    <h1 className="title">Let's Get Started</h1>
                    <p className="description">Let's dive in into your account</p>
                    <div className="SignIn-container">
                        <button className="start no-margin google-signin">
                            <img className="google" src={google} alt="google logo" />
                            <span>Continue with Google</span>
                        </button>
                        <button className="start no-margin">Sign Up</button>
                        <button className="start no-margin white-button">Sign in</button>
                    </div>
                    
                </>
            }
        </main>
            
    )
}