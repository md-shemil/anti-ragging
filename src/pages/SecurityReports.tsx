import React from 'react';
import { Shield, AlertTriangle, FileText, XCircle } from 'lucide-react';

interface SecurityReport {
  id: string;
  timestamp: string;
  userId: string;
  fileName: string;
  fileType: string;
  threatType: string;
  status: 'blocked' | 'warning' | 'clean';
  details: string;
}

const mockReports: SecurityReport[] = [
  {
    id: '1',
    timestamp: '2024-03-15 14:30:00',
    userId: 'user123',
    fileName: 'evidence.pdf',
    fileType: 'application/pdf',
    threatType: 'Malware Signature Detected',
    status: 'blocked',
    details: 'File contained known malware signature pattern'
  },
  {
    id: '2',
    timestamp: '2024-03-14 09:15:00',
    userId: 'user456',
    fileName: 'complaint.pdf',
    fileType: 'application/pdf',
    threatType: 'Suspicious Content',
    status: 'warning',
    details: 'File contains potentially harmful scripts'
  }
];

export function SecurityReports() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Security Reports</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-red-900">Blocked Uploads</h3>
                  <p className="text-2xl font-bold text-red-600">3</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Warnings</h3>
                  <p className="text-2xl font-bold text-yellow-600">5</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-green-900">Clean Files</h3>
                  <p className="text-2xl font-bold text-green-600">42</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Threat Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.fileName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.threatType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === 'blocked'
                            ? 'bg-red-100 text-red-800'
                            : report.status === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {report.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}