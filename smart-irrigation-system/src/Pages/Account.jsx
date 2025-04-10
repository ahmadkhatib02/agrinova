import { useLocation, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { useAuth } from "../contexts/AuthContext"
import { useState, useRef, useEffect } from "react"
import { ref, update, get } from "firebase/database"
import { database } from "../firebase"
import defaultImg from "../images/Blank pfp.jpg"
import button from "../images/button.png"
import eye from "../images/view.png"
import logout from "../images/logout.png"
import "../styles/Account.css"

export default function Account() {
    const { currentUser, setCurrentUser } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [profileImage, setProfileImage] = useState("")
    const fileInputRef = useRef(null)
    const location = useLocation()
    const [userData, setUserData] = useState(null)

    // Convert an imported image to Base64
    const convertImageToBase64 = (imageModule) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            fetch(imageModule.default)
                .then((res) => res.blob())
                .then((blob) => {
                    reader.readAsDataURL(blob)
                    reader.onload = () => resolve(reader.result)
                    reader.onerror = (error) => reject(error)
                })
        })
    }

    // Validate Base64 string
    const isValidBase64 = (base64String) => {
        if (!base64String || typeof base64String !== "string") return false
        return /^data:image\/[a-z]+;base64,/.test(base64String)
    }

    // Load images and initialize profileImage
    useEffect(() => {
        const loadImages = async () => {
            try {
                // Convert default image to Base64
                const base64DefaultImg = await convertImageToBase64(defaultImg)
                setProfileImage(base64DefaultImg)

                // Fetch the latest user data from Firebase if currentUser exists
                if (currentUser && currentUser.id) {
                    const userRef = ref(database, `users/${currentUser.id}`)
                    const snapshot = await get(userRef)
                    if (snapshot.exists()) {
                        const updatedUserData = snapshot.val()

                        // Validate profilePicture before setting it
                        const validProfilePicture = isValidBase64(updatedUserData.profilePicture)
                            ? updatedUserData.profilePicture
                            : base64DefaultImg

                        // Update global context and localStorage
                        setCurrentUser({ ...updatedUserData, profilePicture: validProfilePicture })
                        localStorage.setItem("user", JSON.stringify({ ...updatedUserData, profilePicture: validProfilePicture }))

                        // Set profileImage to the validated value
                        setProfileImage(validProfilePicture)
                    }
                }
            } catch (error) {
                console.error("Error loading images or user data:", error)
            }
        }

        loadImages()
    }, [currentUser, setCurrentUser])

    useEffect(() => {
        const fetchLatestUserData = async () => {
            if (currentUser && currentUser.id) {
                try {
                    const userRef = ref(database, `users/${currentUser.id}`);
                    const snapshot = await get(userRef);
                    
                    if (snapshot.exists()) {
                        const latestUserData = snapshot.val();
                        
                        // Get default image if needed
                        const base64DefaultImg = await convertImageToBase64(defaultImg);
                        
                        // Validate profilePicture
                        const validProfilePicture = isValidBase64(latestUserData.profilePicture)
                            ? latestUserData.profilePicture
                            : base64DefaultImg;
                        
                        // Update state with latest data
                        setProfileImage(validProfilePicture);
                        setUserData(latestUserData);
                        
                        // Update context and localStorage
                        const updatedUser = {
                            ...latestUserData,
                            profilePicture: validProfilePicture
                        };
                        
                        setCurrentUser(updatedUser);
                        localStorage.setItem("user", JSON.stringify(updatedUser));
                    }
                } catch (error) {
                    console.error("Error fetching latest user data:", error);
                }
            }
        };
        
        fetchLatestUserData();
    }, [location.key]);
    // Handle photo change
    const handleChangePhoto = () => {
        fileInputRef.current.click()
    }

    // Handle file selection
    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Check file size (limit to ~500KB)
        if (file.size > 500 * 1024) {
            alert("Image is too large. Please choose an image smaller than 500KB.")
            return
        }

        try {
            setLoading(true)

            // Convert image to Base64
            const base64Image = await convertToBase64(file)

            // Validate the Base64 string before proceeding
            if (!isValidBase64(base64Image)) {
                throw new Error("Generated Base64 string is invalid.")
            }

            setProfileImage(base64Image)

            if (currentUser && currentUser.id) {
                const userRef = ref(database, `users/${currentUser.id}`)

                // Update Firebase
                await update(userRef, {
                    profilePicture: base64Image,
                })

                // Fetch the updated user data from Firebase
                const snapshot = await get(userRef)
                if (snapshot.exists()) {
                    const updatedUserData = snapshot.val()

                    // Update global context and localStorage
                    setCurrentUser({ ...updatedUserData, profilePicture: base64Image })
                    localStorage.setItem("user", JSON.stringify({ ...updatedUserData, profilePicture: base64Image }))
                }
            }
        } catch (error) {
            console.error("Error updating profile picture:", error)
            alert("Failed to update profile picture. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Convert uploaded image to Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })
    }

    // Handle image error
    const handleImageError = () => {
        console.error("Image failed to load:", profileImage)
        setProfileImage(defaultImg)
    }

    if (!currentUser) {
        return (
            <>
                <Header page="account" />
                <div className="loading">Loading user information...</div>
                <Footer page="account" />
            </>
        )
    }

    // Handle logout
    function handleLogOut() {
        navigate("/")
    }

    // Navigate to edit account
    function editAccount() {
        navigate("/edit-account", { state: { user: currentUser } })
    }

    return (
        <>
            <Header page="account" />
            <section className="account-section" onClick={editAccount}>
                <img
                    src={profileImage}
                    alt={`${currentUser.firstName}'s photo`}
                    onError={handleImageError}
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        marginLeft: "3px",
                    }}
                />
                <div>
                    <h3 className="display-name left">{currentUser.firstName} {currentUser.lastName}</h3>
                    <p className="display-email left">{currentUser.email}</p>
                </div>
                <img
                    className="position-button"
                    src={button}
                    alt={`Check ${currentUser.firstName}`}
                />
            </section>

            <section className="account-section">
                <img src={eye} alt="eye icon" style={{ marginLeft: "25px" }} />
                <p>App Appearance</p>
                <img className="position-button" src={button} alt="Check app appearance" />
            </section>

            <section onClick={handleLogOut} className="account-section">
                <img src={logout} alt="logout" style={{ marginLeft: "25px" }} />
                <p style={{ color: "#F86B69", fontWeight: "600" }}>Log out</p>
            </section>
            <Footer page="account" />
        </>
    )
}