# NewsAPI Dashboard

A fully responsive, Apple-inspired news dashboard built with React and Node.js that integrates with NewsAPI to display news articles with advanced filtering capabilities.

## 🎯 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Apple-Style UI**: Clean, minimal interface with card-based layouts
- **Keyword Search**: Search for articles by any keyword or phrase
- **Advanced Filters**: Filter by date, language, and news source
- **Dark Mode**: Toggle between light and dark themes
- **Secure API Proxy**: Backend protects your API key
- **Loading States**: Professional loading indicators
- **Error Handling**: Graceful error messages and API limit management

## 🛠️ Tech Stack

### Frontend
- React 18
- Plain CSS with CSS Modules
- Fetch API for HTTP requests

### Backend
- Node.js
- Express.js
- CORS enabled
- Environment variables for security

## 📁 Project Structure

```
NewsAPI-Dashboard/
├── backend/
│   ├── server.js           # Express server and API routes
│   ├── .env               # Environment variables (API key)
│   ├── package.json       # Backend dependencies
│   └── .gitignore        # Git ignore file
├── frontend/
│   ├── public/
│   │   └── index.html    # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.js      # Search input component
│   │   │   ├── Filters.js        # Filter options component
│   │   │   ├── NewsCard.js       # Individual news card
│   │   │   ├── NewsList.js       # News grid container
│   │   │   ├── DarkModeToggle.js # Dark mode switch
│   │   │   └── LoadingSpinner.js # Loading indicator
│   │   ├── App.js        # Main application component
│   │   ├── App.css       # Main styles
│   │   └── index.js      # React entry point
│   ├── package.json      # Frontend dependencies
│   └── .gitignore       # Git ignore file
└── README.md            # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- NewsAPI key from https://newsapi.org

### Step 1: Clone or Download
Download all project files to your computer.

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# The .env file is already configured with your API key
# If you need to change it, edit backend/.env
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install
```

### Step 4: Run the Application

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm start
```
Backend will run on http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
Frontend will open automatically at http://localhost:3000

## 📖 How to Use

1. **Search**: Enter keywords in the search bar (e.g., "technology", "sports")
2. **Filter by Date**: Select "Today", "This Week", or "This Month"
3. **Filter by Language**: Choose from English, Spanish, French, German, etc.
4. **Filter by Source**: Select specific news sources
5. **Dark Mode**: Click the moon/sun icon to toggle themes
6. **Read Articles**: Click "Read Full Article" to open the original source

## 🎨 Design Principles

This dashboard follows Apple News design philosophy:
- **Whitespace**: Generous spacing for readability
- **Typography**: Clear hierarchy with large headlines
- **Cards**: Content organized in clean, bordered cards
- **Simplicity**: No clutter, focus on content
- **Consistency**: Uniform spacing and styling throughout

## ⚠️ API Limitations (Free Tier)

NewsAPI free tier has the following limits:
- 100 requests per day
- Only articles from the last 30 days
- Development use only

The app handles these limitations by:
- Showing helpful error messages when limits are reached
- Caching results to reduce API calls
- Displaying clear feedback to users

## 🔒 Security

- API key is stored in backend `.env` file (never exposed to frontend)
- Backend acts as a proxy to protect credentials
- `.gitignore` prevents sensitive files from being committed

## 🚧 Future Improvements

- Pagination for more results
- Save favorite articles
- Category-based browsing
- Share articles on social media
- PWA support for offline access
- Article bookmarking with localStorage

## 📝 Assignment Compliance

This project fulfills all assignment requirements:
✅ API key from NewsAPI
✅ Search by keyword/phrase
✅ Filter by date published
✅ Filter by source domain
✅ Filter by language
✅ Proper user interface (React frontend)
✅ Backend API handling (Node.js/Express)
✅ Form for user input
✅ Readable display format with headlines, descriptions, and links

## 🐛 Troubleshooting

**Backend won't start:**
- Ensure Node.js is installed: `node --version`
- Check that port 5000 is not in use
- Verify .env file exists in backend folder

**Frontend won't start:**
- Ensure backend is running first
- Check that port 3000 is available
- Clear npm cache: `npm cache clean --force`

**No news appearing:**
- Check browser console for errors (F12)
- Verify backend is running on port 5000
- Check API key is valid in backend/.env

**API limit reached:**
- Wait 24 hours for limit reset
- Consider upgrading NewsAPI plan
- Use more specific search terms to reduce calls

## 📄 License

This project is created for educational purposes as part of a university assignment.

## 👨‍💻 Author

Created as part of News App Creation assignment (Due: January 16, 2026)
