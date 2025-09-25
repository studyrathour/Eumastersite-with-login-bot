import React from 'react';
import StudentInterface from './StudentInterface';

const BatchesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Student Interface Content */}
      <div className="flex-1">
        <StudentInterface />
      </div>
    </div>
  );
};

export default BatchesPage;