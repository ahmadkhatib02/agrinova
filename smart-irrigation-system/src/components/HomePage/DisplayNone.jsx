import logo from "../../images/Main Logo.png";
import "../../styles/DisplayNone.css"

function DisplayNone(){
    return (
        <article>
            <img className="bottom" src={logo} alt="Main Logo" />
            <h1 className="noPlant typography">You Have No Plants</h1>
            <h2 className="typography noAdded">You haven't added any plants yet.</h2>
        </article> 
    )
}

export default DisplayNone