// ============================================
// REACT ENTRY POINT
// ============================================
// This file is the starting point of the React application
// It renders the main App component into the HTML DOM

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Get the root DOM element where React will render
// This element is defined in public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component
// React.StrictMode helps identify potential problems in the app during development
// It activates additional checks and warnings for its descendants
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Note: In production build, React.StrictMode has no effect on performance
// It only runs in development mode to help catch bugs early
