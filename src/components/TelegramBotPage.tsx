import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Users, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { BOT_CONFIG } from '../bot/config';
import { generateSessionId, simulateUserInteraction, simulateChannelVerification } from '../bot/bot';
import { grantTelegramUserAccess } from '../utils/auth';
import toast from 'react-hot-toast';

const TelegramBotPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [user, setUser] = useState({
    id: 123456789,
    username: 'testuser',
    first_name: 'Test',
    last_name: 'User',
    language_code: 'en',
    is_premium: false
  });

  // Check if we have a session ID from URL parameters
  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    } else {
      // Generate a new session ID if none exists
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
    }
  }, [searchParams]);

  // Simulate user interaction with the bot
  useEffect(() => {
    if (sessionId) {
      const result = simulateUserInteraction(sessionId, user);
      if (!result.success) {
        toast.error(result.message);
      }
    }
  }, [sessionId, user]);

  const handleVerifyMembership = () => {
    if (!sessionId) {
      toast.error('No session ID found');
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('pending');

    // Simulate channel verification
    setTimeout(() => {
      const result = simulateChannelVerification(sessionId, user);
      
      if (result.success) {
        // Grant Telegram-based access
        grantTelegramUserAccess();
        
        setVerificationStatus('success');
        toast.success('Verification successful! Redirecting...');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setVerificationStatus('failed');
        toast.error(result.message || 'Verification failed');
      }
      
      setIsVerifying(false);
    }, 1500);
  };

  const handleTryAgain = () => {
    setVerificationStatus('pending');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-8 border border-secondary">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Telegram Authentication</h1>
          <p className="text-text-secondary">Verify your Telegram membership to access EduMaster</p>
        </div>

        {sessionId ? (
          <div className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="font-medium text-blue-500 mb-2 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Mandatory Channels
              </h3>
              <p className="text-sm text-text-secondary mb-3">
                Please join all the following channels to continue:
              </p>
              <ul className="space-y-2">
                {BOT_CONFIG.MANDATORY_CHANNELS.map((channel, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-text-primary">{channel}</span>
                  </li>
                ))}
              </ul>
            </div>

            {verificationStatus === 'pending' && (
              <button
                onClick={handleVerifyMembership}
                disabled={isVerifying}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Verify Membership
                  </>
                )}
              </button>
            )}

            {verificationStatus === 'success' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-green-500 mb-2">Verification Successful!</h3>
                <p className="text-text-secondary text-sm">
                  You now have access to all EduMaster content.
                </p>
              </div>
            )}

            {verificationStatus === 'failed' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h3 className="font-bold text-red-500 mb-2">Verification Failed</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Please make sure you've joined all mandatory channels.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            )}

            <div className="text-xs text-text-tertiary text-center">
              <p>Session ID: {sessionId.substring(0, 10)}...</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Initializing session...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelegramBotPage;