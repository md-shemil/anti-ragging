import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { Complaint } from "./pages/Complaint";
import { AdminDashboard } from "./pages/AdminDashboard";
import { SecurityReports } from "./pages/SecurityReports";
import { Navbar } from "./components/Navbar";
import { AdminNavbar } from "./components/AdminNavbar";
import { MyComplaints } from "./pages/MyComplaints";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status when app loads
    const token = localStorage.getItem("token");
    const adminStatus = localStorage.getItem("isAdmin") === "true";

    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(adminStatus);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking auth
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setIsAdmin={setIsAdmin}
              />
            }
          />
          <Route path="/register" element={<Register />} />

          {/* Protected Admin Routes */}
          {isAuthenticated && isAdmin && (
            <>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminNavbar />
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/security"
                element={
                  <ProtectedRoute>
                    <AdminNavbar />
                    <SecurityReports />
                  </ProtectedRoute>
                }
              />
            </>
          )}

          {/* Protected User Routes */}
          {isAuthenticated && !isAdmin && (
            <>
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/complaint"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <Complaint />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-complaint"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <MyComplaints />
                  </ProtectedRoute>
                }
              />
            </>
          )}

          {/* Catch-all route */}
          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? (isAdmin ? "/admin" : "/home") : "/login"}
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default App;
