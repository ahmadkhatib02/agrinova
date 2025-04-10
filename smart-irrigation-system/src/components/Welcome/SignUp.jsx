// src/components/SignUp.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import back from "../../images/backTrack.png"
import { useAuth } from "../../contexts/AuthContext"

export default function SignUp({ onBack, onSignIn }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Sign up with custom auth
      await signup(formData.email, formData.password, formData.fullName);
      
      // Navigate to home page on successful registration
      navigate("/homePage");
    } catch (error) {
      console.error("Signup error:", error);
      setAuthError(error.message || "Failed to create an account. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <button className="back-button left down" onClick={onBack}>
        <img src={back} alt="go back to home" />
      </button>  
      <h1 className="title left">Join Agrivona Today 👤</h1>
      <p className="description left down">Create Your Blooming Account</p>
      
      <form onSubmit={handleSubmit} className="auth-form">
        {authError && (
          <div className="auth-error-message">
            {authError}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? "input-error" : ""}
            disabled={loading}
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
            disabled={loading}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
            disabled={loading}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "input-error" : ""}
            disabled={loading}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>
        
        <button 
          type="submit" 
          className="start no-margin auth-button"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
        
        <div className="auth-footer">
          <p>Already have an account? <button type="button" className="link-button" onClick={onSignIn} disabled={loading}>Sign In</button></p>
        </div>
      </form>
    </div>
  );
}