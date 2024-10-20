import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSingleImageClick = () => {
    navigate('/SingleImage');
  };

  const handleMultipleImageClick = () => {
    navigate('/MultipleImage');
  };

  const handleMultiplecontent = () => {
    navigate('/MultipleImageContent');
  };
  



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      <div className="space-x-4">
        <button
          onClick={handleSingleImageClick}
          className="bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
        >
          Single Image
        </button>
        <button
          onClick={handleMultipleImageClick}
          className="bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
        >
          Multiple Images
        </button>
        <button
          onClick={handleMultiplecontent}
          className="bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
        >
          Multiple content
        </button>

      </div>
    </div>
  );
};

export default Dashboard;
