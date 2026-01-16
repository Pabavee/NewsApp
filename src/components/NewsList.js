// ============================================
// NEWS LIST COMPONENT
// ============================================
// Container component that displays a grid of news cards
// Handles responsive layout and empty states

import React from 'react';
import NewsCard from './NewsCard';
import './NewsList.css';

/**
 * NewsList Component
 * 
 * Props:
 * @param {Array} articles - Array of article objects from NewsAPI
 */
function NewsList({ articles }) {
  
  // Handle empty state
  if (!articles || articles.length === 0) {
    return (
      <div className="news-list-empty">
        <span className="empty-icon">📭</span>
        <p>No articles found</p>
      </div>
    );
  }

  return (
    <div className="news-list">
      {/* Map through articles and render a card for each */}
      {articles.map((article, index) => (
        <NewsCard
          key={`${article.url}-${index}`} // Unique key for React reconciliation
          article={article}
        />
      ))}
    </div>
  );
}

export default NewsList;
