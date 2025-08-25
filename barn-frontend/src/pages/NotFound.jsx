import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import UnderConstruction from '../components/shared/UnderConstruction';

const NotFound = () => {
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show popup immediately when component mounts
    setShowPopup(true);
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col justify-center items-center">
      {/* Background content when popup is closed */}
      {!showPopup && (
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The page <code className="bg-gray-200 px-2 py-1 rounded">{location.pathname}</code> doesn't exist.
          </p>
          <button
            onClick={() => setShowPopup(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Show Construction Notice
          </button>
        </div>
      )}

      {/* Under Construction Popup */}
      <UnderConstruction
        isOpen={showPopup}
        onClose={handleClose}
        title="Page Not Found"
        message={`The page "${location.pathname}" you're looking for doesn't exist yet or is currently under development. We're constantly adding new features to enhance your experience!`}
        showBackButton={true}
      />
    </div>
  );
};

export default NotFound;