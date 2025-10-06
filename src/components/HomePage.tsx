import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Video, BookOpen, Zap, Shield } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Batch, LiveClass } from '../types';
import { isUserAuthenticated } from '../utils/auth';

const HomePage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeBatches = firebaseService.onBatchesChange(setBatches);
    const unsubscribeLive = firebaseService.onLiveClassesChange(setLiveClasses);
    setIsLoading(false);

    return () => {
      unsubscribeBatches();
      unsubscribeLive();
    };
  }, []);

  const liveLiveClasses = liveClasses.filter(lc => lc.isLive);
  const books = []; // Placeholder for books data if available
  const goLiveSessions = liveLiveClasses; // Using live classes as live sessions
  const activeLiveSessions = goLiveSessions.filter(session => session.isLive);

  const stats = [
    { label: 'Total Batches', value: batches.length, icon: Users, color: 'from-blue-600 to-blue-700' },
    { label: 'Live Classes', value: liveLiveClasses.length, icon: Video, color: 'from-red-600 to-red-700' },
    { label: 'Books Available', value: books.length, icon: BookOpen, color: 'from-green-600 to-green-700' },
    { label: 'Active Sessions', value: activeLiveSessions.length, icon: Zap, color: 'from-purple-600 to-purple-700' },
  ];

  // Check if user is authenticated
  const isAuthenticated = isUserAuthenticated();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">EduMaster</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Your comprehensive educational platform for live classes, course materials, and interactive learning experiences.
          </p>
          
          {/* Show access message for unauthenticated users */}
          {!isAuthenticated ? (
            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-bold text-yellow-500">Access Required</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You need to verify your access to view content on this platform. 
                Click the button below to get access.
              </p>
              <Link
                to="/verify-token"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Get Access Now
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/batches"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explore Batches
              </Link>
              <Link
                to="/liveclass"
                className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Join Live Classes
              </Link>
            </div>
          )}
        </div>

        {/* Stats Section - only show for authenticated users */}
        {isAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 border border-gray-300 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Access - only show for authenticated users */}
        {isAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link
              to="/batches"
              className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all duration-200 group border border-gray-300 dark:border-gray-700 hover:border-yellow-500"
            >
              <Users className="h-12 w-12 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Next Toppers Batches</h3>
              <p className="text-gray-600 dark:text-gray-400">Elite coaching programs designed for future toppers and achievers.</p>
            </Link>

            <Link
              to="/liveclass"
              className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all duration-200 group border border-gray-300 dark:border-gray-700 hover:border-red-500"
            >
              <Video className="h-12 w-12 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Live Classes</h3>
              <p className="text-gray-600 dark:text-gray-400">Join interactive live sessions and connect with instructors in real-time.</p>
            </Link>

            <Link
              to="/batches"
              className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all duration-200 group border border-gray-300 dark:border-gray-700 hover:border-green-500"
            >
              <BookOpen className="h-12 w-12 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Digital Library</h3>
              <p className="text-gray-600 dark:text-gray-400">Access a vast collection of educational books and reading materials.</p>
            </Link>
          </div>
        )}

        {/* Live Now Section - only show for authenticated users */}
        {isAuthenticated && (liveLiveClasses.length > 0 || activeLiveSessions.length > 0) && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">🔴 Live Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveLiveClasses.map((liveClass) => (
                <div key={liveClass.id} className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-200 border border-gray-300 dark:border-gray-700">
                  <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center relative">
                    <Video className="h-16 w-16 text-white" />
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                      LIVE
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{liveClass.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{liveClass.description}</p>
                    <Link
                      to={`/liveclass`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Join Live
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;