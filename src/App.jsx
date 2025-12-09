import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./HomePage";
import AboutPage from "./pages/About";
import VideoEditor from "./VideoEditor";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";
import LiquidEther from "./pages/LiquidEther";

function App() {
  return (
    <>
      <Router>
        {/* Render liquid background except on editor route */}
        <BackgroundController />
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/editor" element={<VideoEditor />} />
            <Route path="/community" element={<Community />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} /> 
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;

function BackgroundController() {
  const location = useLocation();
  if (location.pathname && location.pathname.startsWith('/editor')) return null;
  return (
    <LiquidEther
      colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
      mouseForce={20}
      cursorSize={100}
      isViscous={false}
      viscous={30}
      iterationsViscous={32}
      iterationsPoisson={32}
      resolution={0.5}
      isBounce={false}
      autoDemo={true}
      autoSpeed={0.5}
      autoIntensity={2.2}
      takeoverDuration={0.25}
      autoResumeDelay={3000}
      autoRampDuration={0.6}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
    />
  );
}
