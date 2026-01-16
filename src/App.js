// ============================================
// MAIN APP COMPONENT
// ============================================
// This is the root component of the application
// It manages all state and coordinates communication between child components

import React, { useState, useEffect } from 'react';
import './App.css';

// Import child components
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import NewsList from './components/NewsList';
import DarkModeToggle from './components/DarkModeToggle';
import LoadingSpinner from './components/LoadingSpinner';

// Backend API URL
// Make sure backend server is running on this port
const API_URL = 'http://localhost:5000/api';

function App() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Articles data from NewsAPI
  const [articles, setArticles] = useState([]);
  
  // Loading state - shows spinner while fetching data
  const [loading, setLoading] = useState(false);
  
  // Error state - stores error messages to display to user
  const [error, setError] = useState(null);
  
  // Search query entered by user
  const [searchQuery, setSearchQuery] = useState('technology'); // Default search
  
  // Filter options
  const [filters, setFilters] = useState({
    language: 'en',     // Default to English
    dateRange: 'week',  // Default to past week
    source: 'all'       // All sources
  });
  
  // Dark mode state - persisted in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a saved preference
    const savedMode = localStorage.getItem('darkMode');
    // Default to light mode if no preference saved
    return savedMode ? JSON.parse(savedMode) : false;
  });
  
  // Available news sources (populated from API)
  const [sources, setSources] = useState([]);

  // ============================================
  // DARK MODE EFFECT
  // ============================================
  // Apply dark mode class to body and save preference
  useEffect(() => {
    // Add or remove 'dark-mode' class from document body
    // This allows us to style the entire app based on theme
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Save preference to localStorage so it persists across sessions
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // ============================================
  // FETCH NEWS SOURCES
  // ============================================
  // Get list of available sources when component mounts
  useEffect(() => {
    fetchSources();
  }, []); // Empty dependency array = run once on mount

  /**
   * Fetch available news sources from NewsAPI
   * This populates the source filter dropdown
   */
  const fetchSources = async () => {
    try {
      const response = await fetch(`${API_URL}/sources?language=en`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setSources(data.sources);
      }
    } catch (err) {
      // Don't show error to user - sources are optional
      console.error('Failed to fetch sources:', err);
    }
  };

  // ============================================
  // FETCH NEWS ARTICLES
  // ============================================
  // This effect runs whenever search query or filters change
  useEffect(() => {
    // Only fetch if we have a search query
    if (searchQuery.trim()) {
      fetchNews();
    }
  }, [searchQuery, filters]); // Re-run when these values change

  /**
   * Calculate date range based on selected filter
   * NewsAPI requires ISO 8601 format: YYYY-MM-DD
   * 
   * @param {string} range - Date range option ('today', 'week', 'month')
   * @returns {string} - ISO formatted date string
   */
  const getDateFrom = (range) => {
    const now = new Date();
    let daysAgo = 7; // Default to 7 days (1 week)
    
    switch (range) {
      case 'today':
        daysAgo = 1;
        break;
      case 'week':
        daysAgo = 7;
        break;
      case 'month':
        daysAgo = 30;
        break;
      default:
        daysAgo = 7;
    }
    
    // Calculate the date
    const pastDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    // Format as YYYY-MM-DD
    return pastDate.toISOString().split('T')[0];
  };

  /**
   * Fetch news articles from backend API
   * This is the main data fetching function
   */
  const fetchNews = async () => {
    // Show loading spinner
    setLoading(true);
    // Clear any previous errors
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams({
        q: searchQuery,                           // Search keyword
        language: filters.language,               // Language filter
        from: getDateFrom(filters.dateRange),    // Date range
        sortBy: 'publishedAt'                    // Sort by newest first
      });

      // Add source filter if not 'all'
      if (filters.source !== 'all') {
        params.append('sources', filters.source);
      }

      // Make API request to our backend
      // Backend acts as proxy to protect API key
      const response = await fetch(`${API_URL}/news?${params}`);
      const data = await response.json();

      // Check if request was successful
      if (data.status === 'success') {
        // Update articles state with fetched data
        setArticles(data.articles);
        
        // Show message if no articles found
        if (data.articles.length === 0) {
          setError('No articles found. Try different search terms or filters.');
        }
      } else {
        // API returned an error
        setError(data.error || 'Failed to fetch news');
      }

    } catch (err) {
      // Network error or other issues
      console.error('Error fetching news:', err);
      setError('Failed to connect to the server. Make sure the backend is running on port 5000.');
    } finally {
      // Hide loading spinner (whether success or failure)
      setLoading(false);
    }
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Handle search form submission
   * @param {Event} e - Form submit event
   */
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent page reload
    // fetchNews() will be called automatically via useEffect
    // when searchQuery changes
  };

  /**
   * Handle filter changes
   * @param {string} filterType - Which filter was changed
   * @param {string} value - New value for the filter
   */
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,        // Keep other filters unchanged
      [filterType]: value    // Update the changed filter
    }));
  };

  /**
   * Toggle dark mode on/off
   */
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="app">
      {/* ========== HEADER SECTION ========== */}
      <header className="app-header">
        <div className="header-content">
          {/* Logo and title */}
          <div className="header-left">
            <h1 className="app-title">
              <span className="app-icon">📰</span>
              NewsAPI Dashboard
            </h1>
          </div>
          
          {/* Dark mode toggle button */}
          <div className="header-right">
            <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
          </div>
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <main className="app-main">
        <div className="app-container">
          
          {/* Search and filter controls */}
          <div className="controls-section">
            {/* Search bar component */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearch}
            />
            
            {/* Filter options component */}
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              sources={sources}
            />
          </div>

          {/* Results section */}
          <div className="results-section">
            {/* Show loading spinner while fetching */}
            {loading && <LoadingSpinner />}
            
            {/* Show error message if something went wrong */}
            {error && !loading && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            )}
            
            {/* Show news articles when loaded successfully */}
            {!loading && !error && articles.length > 0 && (
              <>
                {/* Results count */}
                <div className="results-count">
                  Found {articles.length} article{articles.length !== 1 ? 's' : ''}
                </div>
                
                {/* News grid component */}
                <NewsList articles={articles} />
              </>
            )}
            
            {/* Show welcome message on initial load with no search */}
            {!loading && !error && articles.length === 0 && !searchQuery && (
              <div className="welcome-message">
                <h2>Welcome to NewsAPI Dashboard</h2>
                <p>Enter a keyword to start searching for news articles</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ========== FOOTER ========== */}
      <footer className="app-footer">
        <p>
          Powered by <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer">NewsAPI</a>
          {' • '}
          Created for educational purposes
        </p>
      </footer>
    </div>
  );
}

export default App;
