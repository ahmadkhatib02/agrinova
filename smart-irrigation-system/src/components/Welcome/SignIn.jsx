// src/components/SignIn.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import back from "../../images/backTrack.png"
import { useAuth } from "../../contexts/AuthContext"

export default function SignIn({ onBack, onSignUp }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
 
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
   
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
   
    if (!formData.password) {
      newErrors.password = "Password is required";
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
      
      // Sign in with custom auth
      await login(formData.email, formData.password);
      
      // Navigate to home page on successful login
      navigate("/homePage");
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(error.message || "Failed to sign in. Please check your credentials");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-form-container">
      <button className="back-button left down" onClick={onBack}>
        <img src={back} alt="go back to Home" />
      </button>
   
      <h1 className="title left">Welcome back!👋</h1>
      <p className="description left down">Let's Continue Your Green Journey</p>
       
      <form onSubmit={handleSubmit} className="auth-form">
        {authError && (
          <div className="auth-error-message">
            {authError}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email" className="email-label">Email</label>
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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
            disabled={loading}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        
        <button 
          type="submit" 
          className="start no-margin auth-button"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
           
        <div className="auth-footer">
          <p>Don't have an account? <button type="button" className="link-button" onClick={onSignUp} disabled={loading}>Sign Up</button></p>
        </div>
      </form>
    </div>
  );
}