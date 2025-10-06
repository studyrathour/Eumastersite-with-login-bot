import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { grantUserAccess } from '../utils/auth';
import toast from 'react-hot-toast';
import { Shield, Key, Bot, ExternalLink } from 'lucide-react';

const TokenVerificationPage: React.FC = () => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Grant access to the user
      grantUserAccess();
      toast.success('Access granted! Redirecting...');
      
      // Redirect to home page
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Unexpected error during access granting:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelegramLogin = () => {
    // Redirect to Telegram bot authentication
    window.location.href = '/telegram-bot';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-8 border border-secondary">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Access Verification</h1>
          <p className="text-text-secondary">Choose your preferred method to get access</p>
        </div>

        <div className="space-y-6">
          {/* Token Verification Method */}
          <div className="border border-secondary rounded-lg p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Quick Access
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Access Token
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter any token (verification disabled)"
                    required
                  />
                  <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
                </div>
                <p className="mt-2 text-xs text-text-tertiary">
                  Note: Token verification has been disabled for this deployment
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
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    Grant Access
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Telegram Authentication Method */}
          <div className="border border-secondary rounded-lg p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Telegram Authentication
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              Authenticate through our Telegram bot by joining our channels and verifying your membership.
            </p>
            
            <button
              onClick={handleTelegramLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Bot size={20} />
              Login with Telegram
              <ExternalLink size={16} />
            </button>
            
            <p className="mt-3 text-xs text-text-tertiary text-center">
              You'll be redirected to our Telegram authentication page
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-text-tertiary">
          <p>Need help? Contact support</p>
        </div>
      </div>
    </div>
  );
};

export default TokenVerificationPage;