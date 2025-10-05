import React from 'react';
import { isUserAuthenticated } from '../utils/auth';
import { Link } from 'react-router-dom';
import { Shield, Video } from 'lucide-react';

const LiveClassPage: React.FC = () => {
  const isAuthenticated = isUserAuthenticated();
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-8 border border-secondary text-center">
          <div className="bg-yellow-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Access Required</h2>
          <p className="text-text-secondary mb-6">
            You need to verify your access token to join live classes.
          </p>
          <Link
            to="/verify-token"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Get Access Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full">
      <iframe
        src="https://api-edumasters.netlify.app/"
        title="Live Classes"
        className="w-full h-full border-0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default LiveClassPage;