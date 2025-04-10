import "../styles/WelcomePage.css"
import { useState } from "react"
import mainLogo from "../images/Main Logo.png"
import google from "../images/google.png"
import SignIn from "../components/Welcome/SignIn"
import SignUp from "../components/Welcome/SignUp"


export default function Welcome() {
    const [page, setPage] = useState("welcome") 
    
    function startApp() {
        setPage("begin")
    }
    
    function goToSignIn() {
        setPage("signIn")
    }
    
    function goToSignUp() {
        setPage("signUp")
    }
    
    function goToHome() {
        setPage("welcome")
    }
    
    function goToBegin() {
        setPage("begin")
    }
    
    return (
        <main>
            {page === "welcome" && (
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
            )}
            
            {page === "begin" && (
                <>
                    <img className="logo" src={mainLogo} alt="Main Logo" />
                    <h1 className="title">Let's Get Started</h1>
                    <p className="description">Let's dive in into your account</p>
                    <div className="SignIn-container">
                        {/* <button className="start no-margin google-signin">
                            <img className="google" src={google} alt="google logo" />
                            <span>Continue with Google</span>
                        </button> */}
                        <button className="start no-margin" onClick={goToSignUp}>Sign Up</button>
                        <button className="start no-margin white-button" onClick={goToSignIn}>Sign in</button>
                    </div>
                </>
            )}
            
            {page === "signIn" && (
                <SignIn onBack={goToBegin} onSignUp={goToSignUp} />
            )}
            
            {page === "signUp" && (
                <SignUp onBack={goToBegin} onSignIn={goToSignIn} />
            )}
        </main>
    )
}