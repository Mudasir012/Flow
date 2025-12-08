import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },  // Added About link
    { path: '/editor', label: 'Editor' },
    { path: '/community', label: 'Community' },
    { path: '/contact', label: 'Contact' }
  ];
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="/" className="logo-link">
            <span className="logo-icon">🌀</span>
            <span className="logo-text">Flow</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
              {isActive(item.path) && <div className="liquid-drop" />}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="auth-section">
          <Link to="/login" className="auth-link"><button className="auth-btn login-btn">Log in</button></Link>
          <Link to="/signup" className="auth-link"><button className="auth-btn signup-btn">Sign up</button></Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;