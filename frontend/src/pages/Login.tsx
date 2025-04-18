import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Shield, Mail, Lock, UserCog } from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import logo from "../assets/logo.png"; // your logo

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isAdmin) {
      localStorage.setItem("isAdmin", "true");
      toast.success("Welcome back, Administrator!");
      navigate("/admin");
    } else {
      localStorage.removeItem("isAdmin");
      toast.success("Successfully logged in!");
      navigate("/home");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the Anti-Ragging Committee Portal
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsAdmin(false)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              !isAdmin
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Shield className="h-5 w-5 mr-2" />
            Student/Faculty
          </button>
          <button
            onClick={() => setIsAdmin(true)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isAdmin
                ? "bg-indigo-100 text-indigo-700"
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
                placeholder={isAdmin ? "Enter admin email" : "Enter your email"}
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
                autoComplete="current-password"
                className="pl-10"
                placeholder={
                  isAdmin ? "Enter admin password" : "Enter your password"
                }
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
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>

          <Button type="submit" isLoading={isLoading}>
            {isAdmin ? "Sign in as Administrator" : "Sign in"}
          </Button>

          {!isAdmin && (
            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account?</span>{" "}
              <a
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Create an account
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
