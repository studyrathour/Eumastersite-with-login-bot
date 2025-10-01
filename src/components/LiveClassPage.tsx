import React, { useState, useEffect } from 'react';
import { Video, Clock, Users, Calendar, Bell, Play, X } from 'lucide-react';
import { LiveClass, Notification } from '../types/liveClass';

type TabType = 'live' | 'upcoming' | 'completed';

const LiveClassPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('live');
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<LiveClass[]>([]);
  const [completedClasses, setCompletedClasses] = useState<LiveClass[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchClasses = async (status: TabType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api-edumasters.netlify.app/.netlify/functions/get-classes?status=${status}`
      );
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();

      if (status === 'live') setLiveClasses(data);
      else if (status === 'upcoming') setUpcomingClasses(data);
      else if (status === 'completed') setCompletedClasses(data);
    } catch (err) {
      setError('Failed to load classes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        'https://api-edumasters.netlify.app/.netlify/functions/get-notifications'
      );
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    fetchClasses(activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClassClick = (videoUrl: string) => {
    const playerUrl = `https://edumastervideoplarerwatch.netlify.app/live/${encodeURIComponent(videoUrl)}`;
    window.open(playerUrl, '_blank');
  };

  const getClasses = () => {
    if (activeTab === 'live') return liveClasses;
    if (activeTab === 'upcoming') return upcomingClasses;
    return completedClasses;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Live Classes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join your scheduled classes in real-time
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Current Time: {currentTime.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })} • {currentTime.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {showNotifications && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setShowNotifications(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Notifications
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No notifications
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.read
                        ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        notification.type === 'error' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('live')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'live'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    activeTab === 'live' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                  }`} />
                  Live
                </span>
                {activeTab === 'live' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'upcoming'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Upcoming
                </span>
                {activeTab === 'upcoming' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'completed'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Video className="w-4 h-4" />
                  Completed
                </span>
                {activeTab === 'completed' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => fetchClasses(activeTab)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : getClasses().length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No {activeTab} classes at the moment
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getClasses().map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    classItem={classItem}
                    onJoin={handleClassClick}
                    isUpcoming={activeTab === 'upcoming'}
                    isCompleted={activeTab === 'completed'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ClassCardProps {
  classItem: LiveClass;
  onJoin: (videoUrl: string) => void;
  isUpcoming: boolean;
  isCompleted: boolean;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem, onJoin, isUpcoming, isCompleted }) => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!isUpcoming) return;

    const updateCountdown = () => {
      const now = Date.now();
      const start = new Date(classItem.startTime).getTime();
      const diff = start - now;

      if (diff <= 0) {
        setCountdown('Starting soon...');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setCountdown(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [classItem.startTime, isUpcoming]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');

    return `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${period}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="relative">
        <img
          src={classItem.thumbnailUrl}
          alt={classItem.title}
          className="w-full h-48 object-cover"
        />
        {!isCompleted && !isUpcoming && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full" />
            LIVE
          </div>
        )}
        {isUpcoming && countdown && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            <Clock className="w-3 h-3 inline mr-1" />
            {countdown}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
            {classItem.batch}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {classItem.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span className="truncate">{classItem.tutor.name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(classItem.startTime)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>
              {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
            </span>
          </div>
        </div>

        <button
          onClick={() => onJoin(classItem.tutor.video_url)}
          disabled={isUpcoming}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isUpcoming
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : isCompleted
              ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <Play className="w-4 h-4" />
          {isUpcoming ? 'Not Started' : isCompleted ? 'Watch Recording' : 'Join Now'}
        </button>
      </div>
    </div>
  );
};

export default LiveClassPage;
