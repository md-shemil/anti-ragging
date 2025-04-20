import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import logo from "../assets/logo.png"; // Adjust path if needed

// Password strength checker
function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-red-500", value: 33 };
  if (score === 2 || score === 3)
    return { label: "Medium", color: "bg-yellow-500", value: 66 };
  if (score === 4)
    return { label: "Strong", color: "bg-green-500", value: 100 };

  return { label: "", color: "", value: 0 };
}

export function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    studentId: "",
    department: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.studentId && formData.role === "student") {
      newErrors.studentId = "Student ID is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            studentId: formData.studentId,
            department: formData.department,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Anti-Ragging Committee Logo"
              className="h-12 w-auto"
            />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the Anti-Ragging Committee Portal
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                label="Full name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={errors.name}
                autoComplete="name"
                className="pl-10"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                placeholder="Enter your email"
              />
            </div>

            {/* Role and Department */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Department</option>
                  <option value="cse">Computer Science</option>
                  <option value="ece">Electronics</option>
                  <option value="mech">Mechanical</option>
                  <option value="civil">Civil</option>
                  <option value="other">Other</option>
                </select>
                {errors.department && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.department}
                  </p>
                )}
              </div>
            </div>

            {/* Student ID */}
            {formData.role === "student" && (
              <Input
                id="studentId"
                label="Student ID"
                type="text"
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                error={errors.studentId}
                placeholder="Enter your student ID"
              />
            )}

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
                autoComplete="new-password"
                className="pl-10"
                placeholder="Create a password"
              />
            </div>

            {/* Password strength bar */}
            {formData.password && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className={`${passwordStrength.color} h-2.5 rounded-full`}
                  style={{ width: `${passwordStrength.value}%` }}
                ></div>
              </div>
            )}
            {formData.password && (
              <p className="text-sm font-medium text-gray-600">
                Strength:{" "}
                <span className={`${passwordStrength.color} text-sm font-bold`}>
                  {passwordStrength.label}
                </span>
              </p>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="confirm-password"
                label="Confirm password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={errors.confirmPassword}
                autoComplete="new-password"
                className="pl-10"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          {/* Terms */}
          <div className="text-sm text-gray-600">
            By registering, you agree to our{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </div>

          {/* Submit button */}
          <Button type="submit" isLoading={isLoading}>
            Create account
          </Button>

          {/* Link to login */}
          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>{" "}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
