import React, { createContext, useContext, useState, useEffect } from "react";
import { ref, set, get } from "firebase/database";
import { database } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Sign up function
  async function signup(email, password, fullName) {
    try {
      // Check if user already exists
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      let userId = 1; // Default to 1 if no users exist
      
      if (snapshot.exists()) {
        const users = snapshot.val();
        
        // Check if email already exists
        const userExists = Object.values(users).some(user => user.email === email);
        if (userExists) {
          throw new Error("User with this email already exists");
        }
        
        // Get the number of existing users and add 1 for the new ID
        userId = Object.keys(users).length + 1;
      }
      
      // Split full name into first and last name
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");
      
      // Create user data with plain text password
      const userData = {
        id: userId,
        firstName: firstName,
        lastName: lastName || "",
        email: email,
        password: password, // Plain text password
        profilePicture: "../smart-irrigation-system/src/images/Blank pfp.jpg",
        plants: []
      };
      
      // Save to database
      await set(ref(database, `users/${userId}`), userData);
      
      // Remove sensitive data before storing in state and localStorage
      const userForState = { ...userData };
      delete userForState.password;
      
      // Set current user and store in localStorage
      setCurrentUser(userForState);
      localStorage.setItem('user', JSON.stringify(userForState));
      
      return userForState;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  // Sign in function
  async function login(email, password) {
    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const users = snapshot.val();
        
        // Find user with matching email and password
        const matchedUser = Object.values(users).find(
          user => user.email === email && user.password === password
        );
        
        if (matchedUser) {
          // Remove sensitive data before storing
          const userForState = { ...matchedUser };
          delete userForState.password;
          
          // Set current user and store in localStorage
          setCurrentUser(userForState);
          localStorage.setItem('user', JSON.stringify(userForState));
          
          return userForState;
        } else {
          throw new Error("Invalid email or password");
        }
      } else {
        throw new Error("No users found");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Sign out function
  function logout() {
    setCurrentUser(null);
    localStorage.removeItem('user');
    return Promise.resolve();
  }

  // Get user data from database
  async function getUserData(userId) {
    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        // Remove sensitive data
        delete userData.password;
        
        return userData;
      } else {
        console.log("No user data found in database");
        return null;
      }
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}