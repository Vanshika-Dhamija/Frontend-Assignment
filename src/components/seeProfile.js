import React from 'react';
import { useLocation } from 'react-router-dom';
import  Nav  from './nav';
const SeeProfile = () => {
  const { state } = useLocation();

  if (!state) {
    // Handle the case where state is not available or not passed correctly
    return <div>No data available</div>;
  }

  return (
    <div className="body vh-100 text-white" style={{"background":"#292929"}}>
      <Nav />
    <div className="container mt-5">
      <h1 className="mb-4">User Profile</h1>
      <div className="card">
        <div className="card-body">
          {/* Iterate over the dynamic key-value pairs */}
          {Object.entries(state).map(([key, value]) => (
            <p key={key} className="card-text">
              <strong style={{"text-transform": "uppercase"}}>{key}:</strong> {String(value)}
            </p>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default SeeProfile;
