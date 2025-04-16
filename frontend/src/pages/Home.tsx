import React from "react";
import { FileText, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

// Import your logo image
import logo from "../assets/logo.png"; // Adjust path to your logo

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          {/* Replaced Shield icon with logo image */}
          <img
            src={logo}
            alt="Anti-Ragging Committee Logo"
            className="h-24 w-auto mx-auto mb-6" // Increased size to h-24
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Anti-Ragging Committee Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A safe and secure platform to report ragging incidents. Your
            complaint will be handled with strict confidentiality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Emergency Contacts
            </h2>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                <Phone className="h-5 w-5 mr-3 text-indigo-600" />
                <span>Anti-Ragging Helpline: 1800-180-5522</span>
              </div>
              <div className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                <Mail className="h-5 w-5 mr-3 text-indigo-600" />
                <span>helpline@antiragging.in</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Important Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li className="hover:text-indigo-600 transition-colors">
                Ragging is strictly prohibited inside and outside the campus
              </li>
              <li className="hover:text-indigo-600 transition-colors">
                Ragging is a punishable offense as per UGC regulations
              </li>
              <li className="hover:text-indigo-600 transition-colors">
                Your identity will be kept confidential
              </li>
              <li className="hover:text-indigo-600 transition-colors">
                Immediate action will be taken on verified complaints
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-indigo-700 rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-white mb-4">
            Report an Incident
          </h2>
          <p className="text-indigo-100 mb-6">
            If you have experienced or witnessed any form of ragging, report it
            immediately. Your safety is our priority.
          </p>
          <Link
            to="/complaint"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            File a Complaint
          </Link>
        </div>
      </div>
    </div>
  );
}
