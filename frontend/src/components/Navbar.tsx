import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, FileText, Home, Shield } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-indigo-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">Anti-Ragging Committee</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </Link>
            <Link
              to="/complaint"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            >
              <FileText className="h-5 w-5 mr-2" />
              Report Incident
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}