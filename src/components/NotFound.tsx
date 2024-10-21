import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Cannot Found It</h2>
      <p className="text-gray-600">Sorry, we couldn't find any menu items matching your search.</p>
    </div>
  );
};

export default NotFound;