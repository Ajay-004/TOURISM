import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"; 
import Signup from "./pages/Signup"; // This is your actual page

// Only keep Home as a placeholder if you haven't built pages/Home.jsx yet
const Home = () => (
  <div className="flex items-center justify-center h-screen text-white text-3xl font-bold">
    Welcome to TNFlow Home Page
  </div>
);

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

        {/* Catch-all route: redirects any unknown URL to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;