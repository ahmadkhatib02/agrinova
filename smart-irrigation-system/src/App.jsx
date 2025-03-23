import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./Pages/HomePage"
import Welcome from "./Pages/Welcome"
import AddPlantPage from "./Pages/AddPlantPage"

function App() {
  //for testing to remove later
  const userID = 1
  return (
    <Router>
    <Routes>
      {/* Route for the home page */}
      <Route path="/homePage" element={<HomePage userID = {userID} />} />
      <Route path="/add-plant" element={<AddPlantPage userID={userID} />} />
      {/* Default route - Welcome page */}
      <Route path="/" element ={<Welcome/>}/>
    </Routes>
  </Router>
  )
}

export default App
