import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, FileText, Home } from "lucide-react";
import logo from "../assets/logo.png"; // Import your logo image

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user session
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Replaced Shield icon with logo */}
            <img
              src={logo}
              alt="Anti-Ragging Committee Logo"
              className="h-8 w-auto mr-2"
            />
            <span className="text-lg font-semibold text-gray-900 hidden sm:inline">
              Anti-Ragging Committee
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              <Home className="h-5 w-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              to="/my-complaint"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              <FileText className="h-5 w-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">My Complaints</span>
            </Link>

            <Link
              to="/complaint"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              <FileText className="h-5 w-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Report Incident</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
