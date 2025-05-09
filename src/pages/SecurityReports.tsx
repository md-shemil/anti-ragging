import { useEffect, useState } from "react";
import { Shield, AlertTriangle, FileText, XCircle } from "lucide-react";

interface SecurityReport {
  _id: string;
  createdAt: string;
  name?: string;
  department?: string;
  originalFilename: string;
  fileHash: string;
  status: "clean" | "warning" | "malicious";
  vtLink: string;
  details?: string;
}

export function SecurityReports() {
  const [reports, setReports] = useState<SecurityReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/scans/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch scan reports");
        }

        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const maliciousCount = reports.filter((r) => r.status === "malicious").length;
  const warningCount = reports.filter((r) => r.status === "warning").length;
  const cleanCount = reports.filter((r) => r.status === "clean").length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              Security Reports
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-lg font-medium text-red-700">
                    {maliciousCount}
                  </p>
                  <p className="text-sm text-red-600">Malicious Files</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-lg font-medium text-yellow-700">
                    {warningCount}
                  </p>
                  <p className="text-sm text-yellow-600">Warnings</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-lg font-medium text-green-700">
                    {cleanCount}
                  </p>
                  <p className="text-sm text-green-600">Clean Files</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <p>Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="text-gray-500">No threats or warnings found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      File
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      VirusTotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.name && report.department
                          ? `${report.name} (${report.department})`
                          : "Unknown User"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.originalFilename}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold capitalize">
                        <span
                          className={`text-${
                            report.status === "clean"
                              ? "green"
                              : report.status === "warning"
                              ? "yellow"
                              : "red"
                          }-600`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={report.vtLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 underline"
                        >
                          View Report
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
