import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import HomePage from "./Pages/HomePage";
import Welcome from "./Pages/Welcome";
import AddPlantPage from "./Pages/AddPlantPage";
import AboutPlantPage from "./Pages/AboutPlantPage";
import Account from "./Pages/Account";
import EditAccount from "./components/Account/EditAccount";

// Protected route component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    // Redirect to the welcome page if not logged in
    return <Navigate to="/" />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public route - Welcome page - always show this first */}
      <Route path="/" element={<Welcome />} />
      
      {/* Protected routes - require authentication */}
      <Route 
        path="/homePage" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/add-plant" 
        element={
          <ProtectedRoute>
            <AddPlantPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/about-plant" 
        element={
          <ProtectedRoute>
            <AboutPlantPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/account" 
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } 
      />

      <Route
        path="/edit-account"
        element ={
          <ProtectedRoute>
            <EditAccount />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;