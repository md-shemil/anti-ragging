import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Shield, Mail, Lock, UserCog } from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import logo from "../assets/logo.png";

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
}

export function Login({ setIsAuthenticated, setIsAdmin }: LoginProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Replace with actual API call
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            isAdmin: isAdminLogin,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store user data and tokens
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isAdmin", data.user.isAdmin ? "true" : "false");

        setIsAuthenticated(true);
        setIsAdmin(data.user.isAdmin);

        toast.success(`Welcome back, ${data.user.name || "User"}!`);

        // Redirect based on role
        if (data.user.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/home");
        }

        // Remember me functionality
        if (formData.rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-fill email if "remember me" was checked previously
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isAdminLogin ? "Admin Portal" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isAdminLogin
              ? "Administrator credentials required"
              : "Sign in to access the Anti-Ragging Committee Portal"}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => setIsAdminLogin(false)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              !isAdminLogin
                ? "bg-indigo-100 text-indigo-700 shadow-inner"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Shield className="h-5 w-5 mr-2" />
            Student/Faculty
          </button>
          <button
            type="button"
            onClick={() => setIsAdminLogin(true)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isAdminLogin
                ? "bg-indigo-100 text-indigo-700 shadow-inner"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <UserCog className="h-5 w-5 mr-2" />
            Administrator
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                label="Email address"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
                autoComplete="email"
                className="pl-10"
                placeholder={
                  isAdminLogin
                    ? "admin@university.edu"
                    : "your.email@university.edu"
                }
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
                autoComplete={isAdminLogin ? "off" : "current-password"}
                className="pl-10"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({ ...formData, rememberMe: e.target.checked })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              {!isAdminLogin && (
                <div className="text-sm">
                  <a
                    href="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            {isAdminLogin ? "Admin Sign In" : "Sign In"}
          </Button>

          {!isAdminLogin && (
            <div className="text-center text-sm">
              <span className="text-gray-600">New to the platform?</span>{" "}
              <a
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Create account
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
