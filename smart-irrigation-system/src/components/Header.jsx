import { useState } from "react"
import logo from "../images/header-image.png"
import "../styles/Header.css"


export default function Header ({number , page}) {
    return (
        <header>
            {page === "home" && (
                <>
                    <div className="flex">
                        {/* App Logo */}
                        <img className="header-logo" src={logo} alt="Plantify logo" />
                        <h1 className="center">My Plants</h1>
                </div>
            
                    <div className="center">
                        {/* Display the number of plants */}
                        <p className=" color">Plants ({number})</p>    
                    </div>           
                </>
            )}

            {page === "account" && (
                <div className="flex">
                        {/* App Logo */}
                        <img className="header-logo" src={logo} alt="Plantify logo" />
                        <h1 className="center">Account</h1>
                </div>          
                
            )}
            
        </header>
    )
}