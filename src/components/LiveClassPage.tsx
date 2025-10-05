import React from 'react';

const LiveClassPage: React.FC = () => {
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