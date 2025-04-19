import { Link, useNavigate } from "react-router-dom";
import { Shield, FileText, LogOut, AlertTriangle } from "lucide-react";

export function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-white mr-2" />
            <span className="text-lg font-semibold">Admin Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/admin"
              className="flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 rounded-md"
            >
              <FileText className="h-5 w-5 mr-2" />
              Complaints
            </Link>
            <Link
              to="/admin/security"
              className="flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 rounded-md"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Security Reports
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-300 hover:text-red-100 hover:bg-red-900 rounded-md"
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
