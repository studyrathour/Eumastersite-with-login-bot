import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Clock } from 'lucide-react';
import { checkAccess, clearUserToken } from '../utils/auth';

const AccessTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const tokenData = localStorage.getItem('userTokenData');
      if (!tokenData) return '';
      
      try {
        const { expiration } = JSON.parse(tokenData);
        const now = Date.now();
        const difference = expiration - now;
        
        if (difference <= 0) {
          // Token expired
          return 'Expired';
        }
        
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        return `${hours}h ${minutes}m ${seconds}s`;
      } catch (e) {
        return '';
      }
    };
    
    // Function to check access status with the API
    const checkUserAccess = async () => {
      const tokenData = localStorage.getItem('userTokenData');
      if (!tokenData) return;
      
      try {
        const { userId } = JSON.parse(tokenData);
        if (userId) {
          const response = await checkAccess(userId);
          if (response.hasAccess && response.expiresAt) {
            // Update local storage with the server-provided expiration time
            localStorage.setItem('userTokenData', JSON.stringify({ userId, expiration: response.expiresAt }));
          } else if (!response.hasAccess) {
            // Clear token if access has expired and redirect to verification page
            clearUserToken();
            setShowTimer(false);
            navigate('/verify-token');
          }
        }
      } catch (error) {
        console.error('Error checking access:', error);
      }
    };
    
    // Check access status with API periodically
    const accessCheckInterval = setInterval(() => {
      checkUserAccess();
    }, 60000); // Check every minute
    
    // Initial access check
    checkUserAccess();
    
    const timer = setInterval(() => {
      const timeRemaining = calculateTimeLeft();
      setTimeLeft(timeRemaining);
      
      // Only show timer if there's time left
      setShowTimer(timeRemaining !== '' && timeRemaining !== 'Expired');
    }, 1000);
    
    // Initial calculation
    const timeRemaining = calculateTimeLeft();
    setTimeLeft(timeRemaining);
    setShowTimer(timeRemaining !== '' && timeRemaining !== 'Expired');
    
    return () => {
      clearInterval(timer);
      clearInterval(accessCheckInterval);
    };
  }, [navigate]);

  if (!showTimer) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-surface border border-secondary rounded-lg shadow-lg p-3 flex items-center gap-2">
        <div className="bg-green-500/20 p-2 rounded-full">
          <Shield className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <p className="text-xs text-text-tertiary">Access expires in</p>
          <p className="font-medium text-text-primary flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {timeLeft}
          </p>
        </div>
        <Link 
          to="/verify-token" 
          className="text-xs text-blue-500 hover:text-blue-400 ml-2"
        >
          Renew
        </Link>
      </div>
    </div>
  );
};

export default AccessTimer;