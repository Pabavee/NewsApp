// ============================================
// SEARCH BAR COMPONENT
// ============================================
// Allows users to enter keywords to search for news articles
// Features: Real-time updates, form submission, clear button

import React from 'react';
import './SearchBar.css';

/**
 * SearchBar Component
 * 
 * Props:
 * @param {string} searchQuery - Current search query value
 * @param {function} onSearchChange - Callback when search input changes
 * @param {function} onSearchSubmit - Callback when search form is submitted
 */
function SearchBar({ searchQuery, onSearchChange, onSearchSubmit }) {
  
  /**
   * Handle input change
   * Updates parent component state as user types
   * 
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  /**
   * Clear search input
   * Resets search query to empty string
   */
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <form className="search-bar" onSubmit={onSearchSubmit}>
      {/* Search icon - purely decorative, helps with visual recognition */}
      <div className="search-icon">
        🔍
      </div>
      
      {/* Main search input field */}
      <input
        type="text"
        className="search-input"
        placeholder="Search for news... (e.g., technology, sports, politics)"
        value={searchQuery}
        onChange={handleInputChange}
        // Accessibility: Label for screen readers
        aria-label="Search news articles"
      />
      
      {/* Clear button - only shows when there's text in the input */}
      {searchQuery && (
        <button
          type="button"
          className="clear-button"
          onClick={handleClear}
          aria-label="Clear search"
          title="Clear search"
        >
          ✕
        </button>
      )}
      
      {/* Submit button */}
      <button
        type="submit"
        className="search-button"
        aria-label="Search"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
