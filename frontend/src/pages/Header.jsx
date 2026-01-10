import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-6 h-6 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
              Flow
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              About
            </Link>
            <Link 
              to="/documentation" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Documentation
            </Link>
            <Link 
              to="/api" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              API
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link 
              to="/signin"
              className="px-6 py-2 text-gray-700 font-medium hover:text-purple-600 transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;