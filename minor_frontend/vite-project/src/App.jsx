import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import axios from "axios";

// Pages
import Dashboard from "./pages/Dashboard";
import Donate from "./pages/Donate.jsx";
import Home from "./pages/Home";
import StateSelectionPage from "./pages/StateSelectionPage";

// Components
import Navbar from "./components/Navbar";
import Slideshow from "./components/Slideshow";
import About from "./components/About";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [language, setLanguage] = useState("en");

  const fetchCityData = async (place) => {
    try {
      const response = await axios.get(`http://localhost:5000/test/${place}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error fetching city data:", error);
      return { success: false };
    }
  };

  const LandingPage = () => (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        language={language}
        setLanguage={setLanguage}
      />
      <Slideshow />
      <About language={language} />
      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={<Dashboard fetchCityData={fetchCityData} />}
        />
        <Route path="/state-selection" element={<StateSelectionPage />} />
        <Route path="/donate" element={<Donate />} />
      </Routes>
    </Router>
  );
}

export default App;