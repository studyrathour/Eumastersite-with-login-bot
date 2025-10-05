import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { verifyToken, setUserToken, checkAccess } from '../utils/auth';
import toast from 'react-hot-toast';
import { Shield, Key, Bot, ExternalLink } from 'lucide-react';

const TokenVerificationPage: React.FC = () => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const navigate = useNavigate();

  const validateTokenFormat = (token: string): boolean => {
    // Token must be exactly 12 characters
    // Contains uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and special characters (@#$?:/)
    const tokenRegex = /^[A-Za-z0-9@#$?:/]{12}$/;
    return tokenRegex.test(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate token format
    if (!validateTokenFormat(token)) {
      setIsTokenValid(false);
      toast.error('Invalid token format. Token must be 12 characters long and contain only letters, numbers, and @#$?:/');
      return;
    }
    
    setIsLoading(true);
    setIsTokenValid(true);
    
    try {
      console.log('Verifying token:', token);
      const response = await verifyToken(token);
      console.log('Verification response:', response);
      
      if (response.valid && response.userId) {
        toast.success('Token verified! Checking access...');
        // Token is valid, now check if user has access
        const accessResponse = await checkAccess(response.userId);
        console.log('Access response:', accessResponse);
        
        if (accessResponse.hasAccess && accessResponse.expiresAt) {
          // Store user token data with expiration time from server
          setUserToken(response.userId, accessResponse.expiresAt);
          toast.success('Access granted! Redirecting...');
          // Redirect to home page
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else if (accessResponse.hasAccess === false) {
          // User doesn't have access despite valid token
          toast.error('Token verified but access not granted. Please contact support.');
        } else {
          // Unexpected response
          toast.error('Unexpected response from access check. Please try again.');
        }
      } else {
        // Handle different error messages
        console.log('Token verification failed:', response);
        if (response.message.includes('already been used')) {
          toast.error('Token has already been used. Please request a new token.');
        } else if (response.message.includes('Invalid or expired')) {
          toast.error('Invalid or expired token. Please request a new token.');
        } else if (response.message.includes('Network connection failed')) {
          toast.error('Network connection failed. Please check your internet and try again.');
        } else {
          toast.error(response.message || 'Invalid or expired token. Please try again.');
        }
      }
    } catch (error) {
      console.error('Unexpected error during token verification:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetToken = () => {
    // Open Telegram bot in new tab
    window.open('https://t.me/Acess_EduMaster_bot', '_blank');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-8 border border-secondary">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Access Verification</h1>
          <p className="text-text-secondary">Enter your access token to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Access Token
            </label>
            <div className="relative">
              <input
                type="text"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setIsTokenValid(true);
                }}
                className={`w-full px-4 py-3 bg-background border ${
                  isTokenValid ? 'border-secondary' : 'border-red-500'
                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                placeholder="Enter your 12-character token"
                maxLength={12}
                required
              />
              <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
            </div>
            {!isTokenValid && (
              <p className="mt-1 text-sm text-red-500">Token must be exactly 12 characters</p>
            )}
            <p className="mt-2 text-xs text-text-tertiary">
              Token format: A1b2C3d4@#E5
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              <>
                <Shield size={20} />
                Verify Token
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGetToken}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Bot size={20} />
            Get Token from Telegram Bot
            <ExternalLink size={16} />
          </button>
          <p className="mt-2 text-xs text-text-tertiary text-center">
            Click to open @Acess_EduMaster_bot on Telegram
          </p>
        </div>

        <div className="mt-8 text-center text-sm text-text-tertiary">
          <p>Need help? Contact support</p>
        </div>
      </div>
    </div>
  );
};

export default TokenVerificationPage;