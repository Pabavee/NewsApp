// ============================================
// LOADING SPINNER COMPONENT
// ============================================
// Animated loading indicator shown while fetching data
// Provides visual feedback to user during API requests

import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * 
 * Simple, elegant loading animation
 * Displayed while articles are being fetched from the API
 */
function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      {/* Spinner animation */}
      <div className="loading-spinner" role="status">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      
      {/* Loading text */}
      <p className="loading-text">Loading news articles...</p>
      
      {/* Screen reader text for accessibility */}
      <span className="sr-only">Loading news articles, please wait</span>
    </div>
  );
}

export default LoadingSpinner;
