import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./Pages/HomePage"
import Welcome from "./Pages/Welcome"

function App() {
  
  return (
    <Router>
    <Routes>
      <Route path="/homePage" element={<HomePage />} />
      <Route path="/" element ={<Welcome />}/>
    </Routes>
  </Router>
  )
}

export default App
