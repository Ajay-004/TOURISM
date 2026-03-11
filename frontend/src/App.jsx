import React from "react";
// 1. Change BrowserRouter to HashRouter
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"; 
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import FestivalFinder from "./pages/FestivalFinder";
import Planner from "./pages/Planner";   
import Finder from "./pages/Finder";

function App() {
  return (
    // 2. The <Router> tag now uses HashRouter logic
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/festivals" element={<FestivalFinder />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/finder" element={<Finder />} />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
