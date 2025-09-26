import React, { useState } from 'react';
import { Video, Users, Clock, Calendar } from 'lucide-react';

const LiveClassPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Seamless Embedded Live Class Platform */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 dark:text-gray-300">Loading live classes...</p>
            </div>
          </div>
        )}
        
        <iframe
          src="https://irsion-10-0-hq44-alphaproject.netlify.app/"
          title="EduMaster Live Classes"
          className={`w-full transition-opacity duration-300 ${
            isLoading ? 'opacity-0 h-0' : 'opacity-100'
          }`}
          style={{ 
            height: '100vh',
            border: 'none',
            display: 'block'
          }}
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone; camera"
          onLoad={handleIframeLoad}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  );
};

export default LiveClassPage;