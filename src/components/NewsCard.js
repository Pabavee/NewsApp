// ============================================
// NEWS CARD COMPONENT
// ============================================
// Displays individual news article in a card format
// Features: Image, headline, description, source, date, and link

import React from 'react';
import './NewsCard.css';

/**
 * NewsCard Component
 * 
 * Props:
 * @param {Object} article - News article object from NewsAPI
 *   - title: Article headline
 *   - description: Brief summary
 *   - urlToImage: Article image URL
 *   - url: Link to full article
 *   - source: { name: string } - News source
 *   - publishedAt: ISO date string
 *   - author: Article author (optional)
 */
function NewsCard({ article }) {
  
  /**
   * Format date to human-readable format
   * Converts ISO string to "Month Day, Year" format
   * 
   * @param {string} dateString - ISO format date string
   * @returns {string} - Formatted date (e.g., "Jan 15, 2026")
   */
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  /**
   * Calculate time ago from publish date
   * Shows relative time (e.g., "2 hours ago", "3 days ago")
   * 
   * @param {string} dateString - ISO format date string
   * @returns {string} - Relative time string
   */
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const publishDate = new Date(dateString);
    const diffMs = now - publishDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  /**
   * Handle image error
   * If article image fails to load, hide the image container
   * 
   * @param {Event} e - Image error event
   */
  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  /**
   * Truncate text to specified length
   * Adds ellipsis if text is too long
   * 
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} - Truncated text
   */
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <article className="news-card">
      {/* Article image - only render if URL exists */}
      {article.urlToImage && (
        <div className="news-card-image-container">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="news-card-image"
            onError={handleImageError}
            loading="lazy" // Lazy load images for better performance
          />
        </div>
      )}

      {/* Card content */}
      <div className="news-card-content">
        
        {/* Article metadata (source and time) */}
        <div className="news-card-meta">
          {/* Source name */}
          <span className="news-card-source">
            {article.source.name}
          </span>
          
          <span className="news-card-separator">•</span>
          
          {/* Time published */}
          <span className="news-card-time">
            {getTimeAgo(article.publishedAt)}
          </span>
        </div>

        {/* Article title/headline */}
        <h2 className="news-card-title">
          {truncateText(article.title, 100)}
        </h2>

        {/* Article description */}
        {article.description && (
          <p className="news-card-description">
            {truncateText(article.description, 150)}
          </p>
        )}

        {/* Author (if available) */}
        {article.author && (
          <p className="news-card-author">
            By {article.author}
          </p>
        )}

        {/* Read more link */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="news-card-link"
          aria-label={`Read full article: ${article.title}`}
        >
          Read Full Article →
        </a>
      </div>
    </article>
  );
}

export default NewsCard;
