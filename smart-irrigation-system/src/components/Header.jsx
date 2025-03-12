import logo from "../images/header-image.png"
import "../styles/Header.css"


export default function Header (props) {
    return (
        <header>
            <div className="flex">
                {/* App Logo */}
                <img className="header-logo" src={logo} alt="Plantify logo" />
                <h1 className="center">My Plants</h1>
            </div>
            
        <div className="center">
            {/* Display the number of plants */}
            <p className=" color">Plants ({props.number})</p>    
        </div>           
        </header>
    )
}