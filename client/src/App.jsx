import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Doctors from "./pages/Doctors"
import Appointment from "./pages/Appointment"
import DoctorProfile from "./pages/DoctorProfile"

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
    
      </Routes>

    </Router>
  )
}

export default App