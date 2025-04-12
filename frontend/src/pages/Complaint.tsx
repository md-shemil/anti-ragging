import React, { useState } from "react";
import { Shield, AlertTriangle, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Complaint() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    date: "",
    location: "",
    witnesses: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Get the current user from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user.id) {
        toast.error("You must be logged in to submit a complaint");
        setIsLoading(false);
        return;
      }

      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("user_id", user.id);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("witnesses", formData.witnesses);

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      // Submit form data
      const response = await fetch("http://localhost:5000/submit-complaint", {
        method: "POST",
        body: formDataToSend, // No Content-Type header needed, browser sets it with boundary
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Your complaint has been submitted");
        // Reset form
        setFormData({
          subject: "",
          description: "",
          date: "",
          location: "",
          witnesses: "",
        });
        setSelectedFile(null);
      } else {
        toast.error(data.message || "Failed to submit complaint");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("Failed to submit complaint. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center justify-center mb-8">
            <Shield className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
            Report Ragging Incident
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Your complaint will be treated with strict confidentiality
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Filing a false complaint is a serious offense and may lead to
                  disciplinary action.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="subject"
              label="Subject of Complaint"
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              error={errors.subject}
              placeholder="Brief subject of the incident"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Detailed Description
              </label>
              <div className="mt-1">
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Please provide a detailed account of the incident"
                />
              </div>
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <Input
              id="date"
              label="Date of Incident"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />

            <Input
              id="location"
              label="Location of Incident"
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Where did the incident occur?"
            />

            <Input
              id="witnesses"
              label="Witnesses (if any)"
              type="text"
              value={formData.witnesses}
              onChange={(e) =>
                setFormData({ ...formData, witnesses: e.target.value })
              }
              placeholder="Names of any witnesses"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Supporting Evidence (optional)
              </label>
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                  <Upload className="h-4 w-4 inline-block mr-1" />
                  {selectedFile ? selectedFile.name : "Choose a file"}
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                {selectedFile && (
                  <button
                    type="button"
                    className="ml-2 text-sm text-red-600 hover:text-red-800"
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Upload photos, videos or documents related to the incident
              </p>
            </div>

            <Button type="submit" isLoading={isLoading}>
              Submit Complaint
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
