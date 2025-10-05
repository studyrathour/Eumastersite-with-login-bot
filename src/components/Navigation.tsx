import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, Video, Users, Sun, Moon, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { isUserAuthenticated, isAdminAuthenticated } from '../utils/auth';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  // Don't show navigation on admin pages and embed pages
  if (location.pathname.includes('/surajadminedumasterlogin') || location.pathname.includes('/embed/')) {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Check authentication status
  const isAuthenticated = isUserAuthenticated() || isAdminAuthenticated();

  return (
    <nav className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">EduMaster</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                to="/" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link 
                to="/batches" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/batches') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Users className="w-4 h-4" />
                Batches
              </Link>
              <Link 
                to="/liveclass" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/liveclass') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Video className="w-4 h-4" />
                Live Classes
              </Link>
              
              {/* Show Get Access button for unauthenticated users */}
              {!isAuthenticated && (
                <Link 
                  to="/verify-token" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Get Access
                </Link>
              )}
            </div>
          </div>

          {/* Theme Toggle and Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Mobile menu */}
            <div className="md:hidden flex items-center space-x-2">
              <Link 
                to="/" 
                className={`p-2 rounded-md ${
                  isActive('/') ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Home className="w-5 h-5" />
              </Link>
              <Link 
                to="/batches" 
                className={`p-2 rounded-md ${
                  isActive('/batches') ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-5 h-5" />
              </Link>
              <Link 
                to="/liveclass" 
                className={`p-2 rounded-md ${
                  isActive('/liveclass') ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Video className="w-5 h-5" />
              </Link>
              
              {/* Show Get Access button for unauthenticated users on mobile */}
              {!isAuthenticated && (
                <Link 
                  to="/verify-token" 
                  className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                  <Shield className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;