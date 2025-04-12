import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  linkText: string;
  linkTo: string;
}

export function AuthLayout({ children, title, subtitle, linkText, linkTo }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <LogIn className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        </div>
        {children}
        <div className="text-center">
          <Link to={linkTo} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
}