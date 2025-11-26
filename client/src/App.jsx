import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import ResultsPage from './components/ResultsPage';
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
import './index.css';

function App() {
  const [skills, setSkills] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('skills'); // 'skills' or 'direct'

  const handleSearch = async (selectedSkills, difficultyLevel = 'all') => {
    setSkills(selectedSkills);
    setSearchType('skills');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/repositories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: selectedSkills,
          difficultyLevel
        }),
      });

      const data = await response.json();
      setRepositories(data.repositories || []);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectSearch = async (searchParams) => {
    setSearchType('direct');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();
      setRepositories(data.repositories || []);
    } catch (error) {
      console.error('Error searching repositories:', error);
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={<HomePage onSearch={handleSearch} onDirectSearch={handleDirectSearch} />}
          />
          <Route
            path="/results"
            element={
              <ResultsPage
                skills={skills}
                repositories={repositories}
                loading={loading}
              />
            }
          />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/explore"
            element={<Explore />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
