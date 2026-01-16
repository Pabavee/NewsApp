// ============================================
// BACKEND SERVER - Express.js & NewsAPI Proxy
// ============================================

// Import required packages
const express = require('express');      // Web framework for Node.js
const cors = require('cors');            // Enable Cross-Origin Resource Sharing
const axios = require('axios');          // HTTP client for making API requests
require('dotenv').config();              // Load environment variables from .env file

// Initialize Express application
const app = express();

// Define the port the server will listen on
// Use environment variable PORT if available, otherwise default to 5000
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Enable CORS to allow frontend (running on different port) to make requests
// This is necessary because frontend runs on port 3000, backend on port 5000
app.use(cors());

// Enable JSON parsing for request bodies
// This allows us to receive JSON data from the frontend
app.use(express.json());

// ============================================
// API KEY CONFIGURATION
// ============================================

// Get NewsAPI key from environment variables
// This keeps the API key secure and out of the source code
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Validate that API key exists
if (!NEWS_API_KEY) {
  console.error('ERROR: NEWS_API_KEY is not defined in .env file');
  process.exit(1); // Exit if no API key (can't function without it)
}

// NewsAPI base URL
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Build query parameters for NewsAPI request
 * This function takes user filters and converts them to API parameters
 * 
 * @param {Object} filters - Filter options from frontend
 * @returns {Object} - Formatted parameters for NewsAPI
 */
function buildNewsAPIParams(filters) {
  const params = {
    apiKey: NEWS_API_KEY, // Always include API key
    pageSize: 20,         // Number of articles to return (max 100 for free tier)
  };

  // Add search keyword if provided
  // Example: "technology", "climate change", etc.
  if (filters.q) {
    params.q = filters.q;
  }

  // Add language filter if specified
  // NewsAPI supports: ar, de, en, es, fr, he, it, nl, no, pt, ru, sv, zh
  if (filters.language && filters.language !== 'all') {
    params.language = filters.language;
  }

  // Add date range filter
  // NewsAPI free tier only allows last 30 days
  if (filters.from) {
    params.from = filters.from;
  }

  // Add specific news source if selected
  // Examples: bbc-news, cnn, techcrunch, etc.
  if (filters.sources && filters.sources !== 'all') {
    params.sources = filters.sources;
  }

  // Sort by: relevancy (default), popularity, or publishedAt (newest first)
  params.sortBy = filters.sortBy || 'publishedAt';

  return params;
}

/**
 * Handle API errors and return appropriate messages
 * NewsAPI can return various error codes, this function makes them user-friendly
 * 
 * @param {Object} error - Error object from axios/NewsAPI
 * @returns {Object} - Formatted error response
 */
function handleAPIError(error) {
  // If error has a response from NewsAPI
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data.message || 'Unknown error';

    // Handle specific error codes
    switch (status) {
      case 401:
        return {
          error: 'Invalid API key. Please check your NewsAPI key.',
          code: 'INVALID_API_KEY'
        };
      case 429:
        return {
          error: 'API rate limit exceeded. Free tier allows 100 requests per day.',
          code: 'RATE_LIMIT_EXCEEDED'
        };
      case 426:
        return {
          error: 'This request requires a paid NewsAPI plan.',
          code: 'UPGRADE_REQUIRED'
        };
      case 500:
        return {
          error: 'NewsAPI server error. Please try again later.',
          code: 'SERVER_ERROR'
        };
      default:
        return {
          error: message,
          code: 'API_ERROR'
        };
    }
  }

  // Network or other errors (no response from API)
  return {
    error: 'Unable to connect to NewsAPI. Check your internet connection.',
    code: 'NETWORK_ERROR'
  };
}

// ============================================
// API ROUTES
// ============================================

/**
 * Health check endpoint
 * Used to verify the server is running properly
 * Frontend can ping this to ensure backend is available
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'NewsAPI Dashboard Backend is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Main news endpoint - Everything endpoint
 * This endpoint searches all articles matching the criteria
 * Route: GET /api/news
 * 
 * Query parameters (all optional):
 * - q: Search keyword (e.g., "bitcoin", "sports")
 * - language: Language code (e.g., "en", "es", "fr")
 * - from: Start date (ISO format: YYYY-MM-DD)
 * - sources: Comma-separated source IDs (e.g., "bbc-news,cnn")
 * - sortBy: Sort order (relevancy, popularity, publishedAt)
 */
app.get('/api/news', async (req, res) => {
  try {
    // Log incoming request for debugging
    console.log('📰 News request received:', req.query);

    // Build API parameters from query string
    const params = buildNewsAPIParams(req.query);

    // Make request to NewsAPI everything endpoint
    // This endpoint searches through millions of articles
    const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
      params: params,
      timeout: 10000 // 10 second timeout to prevent hanging
    });

    // Log success
    console.log(`✅ Successfully fetched ${response.data.articles.length} articles`);

    // Return articles to frontend
    res.json({
      status: 'success',
      totalResults: response.data.totalResults,
      articles: response.data.articles
    });

  } catch (error) {
    // Log error for debugging
    console.error('❌ Error fetching news:', error.message);

    // Handle error and send appropriate response
    const errorResponse = handleAPIError(error);
    res.status(error.response?.status || 500).json({
      status: 'error',
      ...errorResponse
    });
  }
});

/**
 * Top headlines endpoint
 * Get breaking news and headlines
 * Route: GET /api/top-headlines
 * 
 * This endpoint is useful for homepage/featured content
 * Free tier allows filtering by country or category
 */
app.get('/api/top-headlines', async (req, res) => {
  try {
    console.log('📰 Top headlines request received:', req.query);

    const params = {
      apiKey: NEWS_API_KEY,
      pageSize: 20,
    };

    // Add country filter (e.g., "us", "gb", "ca")
    if (req.query.country) {
      params.country = req.query.country;
    }

    // Add category filter (business, entertainment, health, science, sports, technology)
    if (req.query.category) {
      params.category = req.query.category;
    }

    // Add search query if provided
    if (req.query.q) {
      params.q = req.query.q;
    }

    // Make request to NewsAPI top-headlines endpoint
    const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
      params: params,
      timeout: 10000
    });

    console.log(`✅ Successfully fetched ${response.data.articles.length} top headlines`);

    res.json({
      status: 'success',
      totalResults: response.data.totalResults,
      articles: response.data.articles
    });

  } catch (error) {
    console.error('❌ Error fetching top headlines:', error.message);
    const errorResponse = handleAPIError(error);
    res.status(error.response?.status || 500).json({
      status: 'error',
      ...errorResponse
    });
  }
});

/**
 * Sources endpoint
 * Get list of available news sources
 * Route: GET /api/sources
 * 
 * Returns all news sources available in NewsAPI
 * Useful for populating source filter dropdown
 */
app.get('/api/sources', async (req, res) => {
  try {
    console.log('📰 Sources request received');

    // Request all sources from NewsAPI
    const response = await axios.get(`${NEWS_API_BASE_URL}/sources`, {
      params: {
        apiKey: NEWS_API_KEY,
        language: req.query.language || 'en' // Default to English
      },
      timeout: 10000
    });

    console.log(`✅ Successfully fetched ${response.data.sources.length} sources`);

    res.json({
      status: 'success',
      sources: response.data.sources
    });

  } catch (error) {
    console.error('❌ Error fetching sources:', error.message);
    const errorResponse = handleAPIError(error);
    res.status(error.response?.status || 500).json({
      status: 'error',
      ...errorResponse
    });
  }
});

// ============================================
// ERROR HANDLING & 404
// ============================================

/**
 * 404 handler for undefined routes
 * Catches any requests to routes that don't exist
 */
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/news',
      'GET /api/top-headlines',
      'GET /api/sources'
    ]
  });
});

/**
 * Global error handler
 * Catches any unhandled errors in the application
 */
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    error: 'Internal server error',
    message: err.message
  });
});

// ============================================
// START SERVER
// ============================================

/**
 * Start the Express server
 * Listen on specified port and log success message
 */
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  NewsAPI Dashboard Backend Server     ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/*`);
  console.log(`🔑 API Key loaded: ${NEWS_API_KEY ? '✅ Yes' : '❌ No'}`);
  console.log('───────────────────────────────────────');
  console.log('Available endpoints:');
  console.log('  • GET /api/health - Server health check');
  console.log('  • GET /api/news - Search news articles');
  console.log('  • GET /api/top-headlines - Breaking news');
  console.log('  • GET /api/sources - Available sources');
  console.log('───────────────────────────────────────');
  console.log('Press Ctrl+C to stop the server');
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

/**
 * Handle graceful shutdown on Ctrl+C
 * Ensures proper cleanup before process exits
 */
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});
