# Open Source Repository Finder

Find the perfect open source repositories to contribute to based on your skills. Built with Express.js and React.

## Features

- 🎯 **Skill-Based Matching** - Find repositories that match your technical expertise
- 🚀 **Beginner Friendly** - Discover projects with good-first-issue labels
- ⭐ **Quality Projects** - Curated from popular and active repositories
- 🎨 **Modern UI** - Beautiful, responsive design with dark theme and glassmorphism
- ⚡ **Fast Search** - Quick results from GitHub's repository database

## Tech Stack

### Backend
- **Express.js** - Node.js web framework
- **Axios** - HTTP client for GitHub API
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **Vite** - Fast build tool and dev server
- **CSS3** - Modern styling with custom properties and animations

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   cd /Users/neelanshu./Desktop/Repo\ Reccomendation
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure environment variables (optional)**
   ```bash
   cp .env.example .env
   # Add your GitHub personal access token to .env for higher rate limits
   ```

## Usage

### Development Mode

1. **Start the backend server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

2. **In a new terminal, start the frontend dev server**
   ```bash
   npm run client
   ```
   The React app will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to use the application

### Production Build

```bash
# Build the React frontend
npm run build

# Start the server (serves built React app)
npm start
```

## API Documentation

### POST `/api/repositories`

Search for repositories based on skills.

**Request Body:**
```json
{
  "skills": ["javascript", "react", "python"]
}
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "repositories": [
    {
      "id": 123456,
      "name": "awesome-project",
      "fullName": "user/awesome-project",
      "description": "An amazing open source project",
      "url": "https://github.com/user/awesome-project",
      "stars": 1500,
      "forks": 200,
      "language": "JavaScript",
      "topics": ["react", "nodejs", "opensource"],
      "openIssues": 25,
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### GET `/api/health`

Check API status.

**Response:**
```json
{
  "status": "OK",
  "message": "API is running"
}
```

## How It Works

1. **User Input** - Enter your programming skills (e.g., JavaScript, Python, React)
2. **GitHub Search** - The backend queries GitHub's API for repositories matching your skills with "good-first-issue" or "help-wanted" labels
3. **Results Display** - View curated repositories sorted by popularity with detailed information
4. **Contribute** - Click on any repository to visit it on GitHub and start contributing!

## Project Structure

```
repo-recommendation/
├── server.js              # Express server
├── routes/
│   └── api.js            # API routes and GitHub integration
├── package.json          # Backend dependencies
├── .env.example          # Environment variables template
└── client/               # React frontend
    ├── src/
    │   ├── App.jsx       # Main app component
    │   ├── index.css     # Global styles and design system
    │   ├── components/
    │   │   ├── HomePage.jsx         # Landing page
    │   │   ├── HomePage.css
    │   │   ├── SkillInput.jsx      # Skill input component
    │   │   ├── SkillInput.css
    │   │   ├── ResultsPage.jsx     # Results display
    │   │   ├── ResultsPage.css
    │   │   ├── RepositoryCard.jsx  # Repository card
    │   │   └── RepositoryCard.css
    │   └── main.jsx      # React entry point
    ├── index.html        # HTML template
    └── package.json      # Frontend dependencies
```

## Features in Detail

### Skill-Based Search
- Add multiple skills to refine your search
- Quick-add popular skills with one click
- Tag-based interface for easy management

### Repository Information
- Repository name and description
- Star count, forks, and open issues
- Primary programming language
- Topic tags
- Last update timestamp
- Direct link to GitHub

### Modern UI/UX
- Dark theme with vibrant gradients
- Glassmorphism effects
- Smooth animations and transitions
- Fully responsive design
- Hover effects and micro-interactions

## GitHub API Rate Limits

- **Unauthenticated**: 60 requests per hour
- **Authenticated**: 5000 requests per hour

To increase rate limits, add a GitHub personal access token to your `.env` file:

```
GITHUB_TOKEN=your_github_token_here
```

## License

MIT

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
