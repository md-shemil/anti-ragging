import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Shield, Clock, AlertCircle, CheckCircle } from "lucide-react";

// Types
interface Complaint {
  _id: string; // Assuming your database uses _id
  subject: string;
  date: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  description: string;
  response?: string;
}

export function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you're storing the JWT token
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/complaints/my-complaints`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token in headers
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setComplaints(data || []);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch complaints");
        }
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError("Something went wrong while fetching complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm">
            <Clock className="h-4 w-4 mr-1" />
            Pending
          </span>
        );
      case "investigating":
        return (
          <span className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            Under Investigation
          </span>
        );
      case "resolved":
        return (
          <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading complaints...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                You haven't filed any complaints yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {complaint.subject}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Filed on{" "}
                        {format(new Date(complaint.date), "MMMM d, yyyy")}
                      </p>
                    </div>
                    {getStatusBadge(complaint.status)}
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Description:
                    </h4>
                    <p className="text-gray-600 bg-gray-50 rounded-lg p-3">
                      {complaint.description}
                    </p>
                  </div>

                  {complaint.response && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Committee Response:
                      </h4>
                      <p className="text-gray-600 bg-indigo-50 rounded-lg p-3">
                        {complaint.response}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
