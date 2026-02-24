import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"; 
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import FestivalFinder from "./pages/FestivalFinder";
import Planner from "./pages/Planner";   
import Finder from "./pages/Finder";// This is your actual page

// Only keep Home as a placeholder if you haven't built pages/Home.jsx yet


function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect empty path to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Your defined routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/festivals" element={<FestivalFinder />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/finder" element={<Finder />} />
        {/* Catch-all route: redirects any unknown URL to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;