import { useLocation, useNavigate } from "react-router-dom"
import back from "../../images/backTrack.png"
import defaultImg from "../../images/Blank pfp.jpg"
import { useState, useRef, useEffect } from "react"
import { ref, update } from "firebase/database"
import { database } from "../../firebase"

export default function EditAccount() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = location.state || {}

    if (!user) {
        console.error("User data is missing. Redirecting to account page.")
        navigate("/account")
        return null
    }

    // State for form fields
    const [firstName, setFirstName] = useState(user.firstName)
    const [lastName, setLastName] = useState(user.lastName)
    const [profilePicture, setProfilePicture] = useState("")
    const [loading, setLoading] = useState(false)

    const fileInputRef = useRef(null)

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

    // Load default image and initialize profilePicture
    useEffect(() => {
        const loadImages = async () => {
            try {
                // Convert default image to Base64
                const base64DefaultImg = await convertImageToBase64(defaultImg)
                // Use user.profilePicture if available, otherwise fallback to defaultImg
                setProfilePicture(user.profilePicture || base64DefaultImg)
            } catch (error) {
                console.error("Error loading images:", error)
            }
        }

        loadImages()
    }, [user])

    // Convert uploaded image to Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })
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
            const base64Image = await convertToBase64(file)
            setProfilePicture(base64Image) // Update the profilePicture state
        } catch (error) {
            console.error("Error converting image:", error)
            alert("Failed to process image. Please try again.")
        }
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            // Log the current state to debug
            console.log("Updating profile with:", { firstName, lastName, profilePicture })

            // Update user data in Firebase
            const userRef = ref(database, `users/${user.id}`)
            await update(userRef, {
                firstName,
                lastName,
                profilePicture, // Ensure this is the correct state variable
            })

            // Update local storage
            const updatedUser = { ...user, firstName, lastName, profilePicture }
            localStorage.setItem("user", JSON.stringify(updatedUser))

            alert("Profile updated successfully!")
            window.location.href = "/account" 
        } catch (error) {
            console.error("Error updating profile:", error)
            alert("Failed to update profile. Please try again.")
        } finally {
            setLoading(false)
        }
    }


    return (
        <>
                <header className="header">
                    <button onClick={() => navigate("/account")} className="back-button">
                        <img src={back} alt="go back" />
                    </button>
                    <h1 className="plantName">Edit Profile</h1>
                </header>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Profile Picture */}
                    <div className="profile-image-container">
                        <img
                            src={profilePicture}
                            alt={`${firstName}'s photo`}
                            className="profile-picture"
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: "none" }}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="start no-margin"
                        >
                            Change Photo
                        </button>
                    </div>
    
                    {/* First Name */}
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="placeholder"
                        />
                    </div>
    
                    {/* Last Name */}
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="placeholder"
                        />
                    </div>
    
                    {/* Submit Button */}
                    <button type="submit" disabled={loading} className="start no-margin auth-button">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
        </>
    )
}