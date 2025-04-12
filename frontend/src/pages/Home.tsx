import React from 'react';
import { Shield, FileText, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Anti-Ragging Committee Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A safe and secure platform to report ragging incidents. Your complaint will be handled with strict confidentiality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Emergency Contacts</h2>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Phone className="h-5 w-5 mr-3 text-indigo-600" />
                <span>Anti-Ragging Helpline: 1800-180-5522</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Mail className="h-5 w-5 mr-3 text-indigo-600" />
                <span>helpline@antiragging.in</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Information</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Ragging is strictly prohibited inside and outside the campus</li>
              <li>Ragging is a punishable offense as per UGC regulations</li>
              <li>Your identity will be kept confidential</li>
              <li>Immediate action will be taken on verified complaints</li>
            </ul>
          </div>
        </div>

        <div className="bg-indigo-700 rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Report an Incident</h2>
          <p className="text-indigo-100 mb-6">
            If you have experienced or witnessed any form of ragging, report it immediately.
            Your safety is our priority.
          </p>
          <Link
            to="/complaint"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
          >
            <FileText className="h-5 w-5 mr-2" />
            File a Complaint
          </Link>
        </div>
      </div>
    </div>
  );
}