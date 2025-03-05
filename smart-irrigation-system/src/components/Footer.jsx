import plantIcon from "../images/plants-footer-active.png"
import profileIcon from "../images/profile-tab-active.png"
import "../styles/Footer.css"

export default function Footer () {
    return (
        <footer>
            <div className="tab">
                <img className="tab-img" src={plantIcon} alt="plant tab" />
                <p className="typography active">My Plants</p>
            </div>

            <div className="tab">
                <img className="tab-img" src={profileIcon} alt="Account tab" />
                <p className="typography inactive">Account</p>
            </div>
        </footer>
    )
}