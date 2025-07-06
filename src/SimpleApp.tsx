import React from 'react';

const SimpleApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">EcoBlock Dashboard</h1>
        <p className="text-gray-600 mb-4">Simple test version</p>
        <div className="space-y-2">
          <div className="text-sm text-gray-500">✅ React app is working</div>
          <div className="text-sm text-gray-500">✅ Tailwind CSS is working</div>
          <div className="text-sm text-gray-500">✅ No infinite loops</div>
        </div>
      </div>
    </div>
  );
};

export default SimpleApp;
