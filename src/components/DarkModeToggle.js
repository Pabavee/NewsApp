// ============================================
// DARK MODE TOGGLE COMPONENT
// ============================================
// Switch button to toggle between light and dark themes
// Features: Smooth animation, icon change, accessible

import React from 'react';
import './DarkModeToggle.css';

/**
 * DarkModeToggle Component
 * 
 * Props:
 * @param {boolean} darkMode - Current dark mode state
 * @param {function} onToggle - Callback to toggle dark mode
 */
function DarkModeToggle({ darkMode, onToggle }) {
  return (
    <button
      className="dark-mode-toggle"
      onClick={onToggle}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={darkMode}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Icon changes based on current mode */}
      <span className="toggle-icon" role="img" aria-hidden="true">
        {darkMode ? '☀️' : '🌙'}
      </span>
      
      {/* Optional text label (hidden on mobile) */}
      <span className="toggle-text">
        {darkMode ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}

export default DarkModeToggle;
