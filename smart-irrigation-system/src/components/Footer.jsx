import plantIcon from "../images/plants-footer-active.png"
import profileIcon from "../images/profile-tab-active.png"
import "../styles/Footer.css"

export default function Footer () {
    return (
        <footer>
            <div className="tab">
                {/* Active tab for plant section */}
                <img className="tab-img" src={plantIcon} alt="plant tab" />
                <p className="active">My Plants</p>
            </div>

            <div className="tab">
                {/* Inactive tab for user account */}
                <img className="tab-img" src={profileIcon} alt="Account tab" />
                <p className="inactive">Account</p>
            </div>
        </footer>
    )
}