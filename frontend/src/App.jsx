import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AboutPage from './pages/Aboutpage';
import LandingPage from './pages/Landingpage';
import DocumentationPage from './pages/Documentation';
import Contact from './pages/Contact';
import ApiPage from './pages/Api';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import Dashboard from './pages/Dashboard';
import VideoEditor from './pages/VideoEditor';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/signin" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/api" element={<ApiPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/videoeditor"
          element={
            <ProtectedRoute>
              <VideoEditor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;