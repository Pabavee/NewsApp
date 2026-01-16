// ============================================
// FILTERS COMPONENT
// ============================================
// Provides filtering options for news articles:
// - Date range (today, week, month)
// - Language selection
// - News source selection

import React from 'react';
import './Filters.css';

/**
 * Filters Component
 * 
 * Props:
 * @param {Object} filters - Current filter values { language, dateRange, source }
 * @param {function} onFilterChange - Callback when any filter changes
 * @param {Array} sources - Available news sources from NewsAPI
 */
function Filters({ filters, onFilterChange, sources }) {
  
  /**
   * Handle filter change
   * Calls parent callback with filter type and new value
   * 
   * @param {Event} e - Change event from select element
   * @param {string} filterType - Which filter was changed
   */
  const handleChange = (e, filterType) => {
    onFilterChange(filterType, e.target.value);
  };

  return (
    <div className="filters">
      <h3 className="filters-title">Filters</h3>
      
      <div className="filters-grid">
        
        {/* ============================================
            DATE RANGE FILTER
            ============================================
            Allows filtering by when article was published
            Options: Today, This Week, This Month
        */}
        <div className="filter-group">
          <label htmlFor="date-filter" className="filter-label">
            📅 Date Range
          </label>
          <select
            id="date-filter"
            className="filter-select"
            value={filters.dateRange}
            onChange={(e) => handleChange(e, 'dateRange')}
            aria-label="Filter by date range"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* ============================================
            LANGUAGE FILTER
            ============================================
            Filter articles by language
            Common languages supported by NewsAPI
        */}
        <div className="filter-group">
          <label htmlFor="language-filter" className="filter-label">
            🌍 Language
          </label>
          <select
            id="language-filter"
            className="filter-select"
            value={filters.language}
            onChange={(e) => handleChange(e, 'language')}
            aria-label="Filter by language"
          >
            <option value="en">English</option>
            <option value="es">Spanish (Español)</option>
            <option value="fr">French (Français)</option>
            <option value="de">German (Deutsch)</option>
            <option value="it">Italian (Italiano)</option>
            <option value="pt">Portuguese (Português)</option>
            <option value="ru">Russian (Русский)</option>
            <option value="ar">Arabic (العربية)</option>
            <option value="zh">Chinese (中文)</option>
          </select>
        </div>

        {/* ============================================
            SOURCE FILTER
            ============================================
            Filter by specific news source
            Dynamically populated from NewsAPI sources
        */}
        <div className="filter-group">
          <label htmlFor="source-filter" className="filter-label">
            📰 Source
          </label>
          <select
            id="source-filter"
            className="filter-select"
            value={filters.source}
            onChange={(e) => handleChange(e, 'source')}
            aria-label="Filter by news source"
          >
            {/* Default option - show all sources */}
            <option value="all">All Sources</option>
            
            {/* Dynamically render available sources */}
            {sources.map(source => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
          
          {/* Show helper text if sources haven't loaded yet */}
          {sources.length === 0 && (
            <span className="filter-hint">Loading sources...</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Filters;
