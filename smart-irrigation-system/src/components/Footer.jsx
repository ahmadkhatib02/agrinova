import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLeaf, faUser } from "@fortawesome/free-solid-svg-icons"
import "../styles/Footer.css"
import { useNavigate } from "react-router-dom"

export default function Footer ({page}) {
    
    const[isActive , setIsActive] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if(page === "home"){
            setIsActive("plants")
        }
        else if(page === "account"){
            setIsActive("account")
        }
    }, [page])

    function switchTabs (event) {
        if(event.currentTarget.dataset.plant){
            setIsActive("plants")
            navigate("/homePage")
        }
        else if(event.currentTarget.dataset.account){
            setIsActive("account")
            navigate("/account")
            
        }
    }

    return (
        <footer>
            <div className="tab">
                
               <FontAwesomeIcon onClick={switchTabs} data-plant ="plant"
                    icon={faLeaf} className= {`tab-img ${isActive==="plants" && "active"}`}/>
                <p className={`${isActive=="plants"? "active": "inactive"}`}>My Plants</p>
            </div>

            <div className="tab">
                <FontAwesomeIcon onClick={switchTabs} data-account = "account"
                    icon={faUser} className= {`tab-img ${isActive==="account" && "active"}`}/>
                <p className={`${isActive=="account"? "active": "inactive"}`}>Account</p>
            </div>
        </footer>
    )
}