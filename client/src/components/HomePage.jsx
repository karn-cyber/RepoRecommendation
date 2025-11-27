import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import SkillInput from './SkillInput';
import SearchBar from './SearchBar';
import SplineRobot from './SplineRobot';
import './HomePage.css';

const popularSkills = [
    'JavaScript', 'Python', 'Java', 'TypeScript', 'React',
    'Node.js', 'Go', 'Rust', 'C++', 'Ruby',
    'PHP', 'Swift', 'Kotlin', 'Vue', 'Angular'
];

const [dsaProblems, setDsaProblems] = useState({ leetcode: [], codeforces: [] });
const [dsaType, setDsaType] = useState('interview'); // 'interview' or 'cp'

useEffect(() => {
    fetch('/api/dsa/daily')
        .then(res => res.json())
        .then(data => setDsaProblems(data))
        .catch(err => console.error('Failed to fetch DSA problems:', err));
}, []);

return (
    <div className="home-page">
        <div className="hero-section">
            <div className="container">
                <div className="hero-split">
                    <div className="hero-content fade-in">
                        <h1 className="hero-title">
                            Discover Your Next
                            <span className="gradient-text"> Open Source </span>
                            Contribution
                        </h1>
                        <p className="hero-subtitle">
                            Find the perfect repositories to contribute based on your skills.
                            Join thousands of developers making an impact.
                        </p>

                        <div className="skill-section">
                            <SkillInput
                                selectedSkills={selectedSkills}
                                onSkillAdd={handleSkillAdd}
                                onSkillRemove={handleSkillRemove}
                                onSearch={handleSearch}
                            />

                            <div className="difficulty-selector">
                                <p className="difficulty-label">Difficulty Level:</p>
                                <div className="difficulty-options">
                                    <label className={`difficulty-option ${difficultyLevel === 'all' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="difficulty"
                                            value="all"
                                            checked={difficultyLevel === 'all'}
                                            onChange={(e) => setDifficultyLevel(e.target.value)}
                                        />
                                        <span className="option-text">All</span>
                                    </label>
                                    <label className={`difficulty-option ${difficultyLevel === 'beginner' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="difficulty"
                                            value="beginner"
                                            checked={difficultyLevel === 'beginner'}
                                            onChange={(e) => setDifficultyLevel(e.target.value)}
                                        />
                                        <span className="option-text">Beginner</span>
                                        <span className="option-desc">Good first issues</span>
                                    </label>
                                    <label className={`difficulty-option ${difficultyLevel === 'intermediate' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="difficulty"
                                            value="intermediate"
                                            checked={difficultyLevel === 'intermediate'}
                                            onChange={(e) => setDifficultyLevel(e.target.value)}
                                        />
                                        <span className="option-text">Intermediate</span>
                                        <span className="option-desc">Moderate complexity</span>
                                    </label>
                                    <label className={`difficulty-option ${difficultyLevel === 'advanced' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="difficulty"
                                            value="advanced"
                                            checked={difficultyLevel === 'advanced'}
                                            onChange={(e) => setDifficultyLevel(e.target.value)}
                                        />
                                        <span className="option-text">Advanced</span>
                                        <span className="option-desc">Popular projects</span>
                                    </label>
                                </div>
                            </div>

                            <div className="popular-skills">
                                <p className="popular-label">Popular Skills:</p>
                                <div className="skill-chips">
                                    {popularSkills.map((skill) => (
                                        <button
                                            key={skill}
                                            className={`skill-chip ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                                            onClick={() => handleSkillAdd(skill)}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedSkills.length > 0 && (
                                <button className="btn btn-primary search-btn" onClick={handleSearch}>
                                    <Search size={20} />
                                    Find Repositories ({selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''})
                                </button>
                            )
                            }
                        </div>

                        <div className="search-divider">
                            <span className="divider-text">OR</span>
                        </div>

                        <div className="direct-search-section">
                            <h3 className="search-method-title">Search by Repository or Organization</h3>
                            <SearchBar onSearch={handleDirectSearch} />
                        </div>
                    </div>

                    <div className="hero-robot fade-in">
                        <SplineRobot />
                    </div>
                </div>
            </div>
        </div>

        {/* Daily DSA Challenge Section */}
        <div className="dsa-section fade-in">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Daily Coding Challenge</h2>
                    <div className="dsa-toggle">
                        <button
                            className={`toggle-btn ${dsaType === 'interview' ? 'active' : ''}`}
                            onClick={() => setDsaType('interview')}
                        >
                            Interview Prep
                        </button>
                        <button
                            className={`toggle-btn ${dsaType === 'cp' ? 'active' : ''}`}
                            onClick={() => setDsaType('cp')}
                        >
                            Competitive Programming
                        </button>
                    </div>
                </div>

                <div className="dsa-grid">
                    {dsaType === 'interview' ? (
                        dsaProblems.leetcode?.map((prob, idx) => (
                            <a key={idx} href={prob.url} target="_blank" rel="noopener noreferrer" className="dsa-card">
                                <div className="dsa-card-header">
                                    <span className={`difficulty-badge ${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span>
                                    <span className="platform-badge">LeetCode</span>
                                </div>
                                <h3>{prob.title}</h3>
                                <p>Solve this to improve your algorithmic skills.</p>
                            </a>
                        ))
                    ) : (
                        dsaProblems.codeforces?.map((prob, idx) => (
                            <a key={idx} href={prob.url} target="_blank" rel="noopener noreferrer" className="dsa-card">
                                <div className="dsa-card-header">
                                    <span className="difficulty-badge cp">{prob.difficulty}</span>
                                    <span className="platform-badge">Codeforces</span>
                                </div>
                                <h3>{prob.title}</h3>
                                <p>Challenge yourself with this CP problem.</p>
                            </a>
                        ))
                    )}
                </div>
            </div>
        </div>

        <div className="features-section">
            <div className="container">
                <div className="features-grid">
                    <div className="feature-card fade-in">
                        <div className="feature-icon">🎯</div>
                        <h3>Skill-Based Matching</h3>
                        <p>Find repositories that match your expertise and interests</p>
                    </div>
                    <div className="feature-card fade-in">
                        <div className="feature-icon">🚀</div>
                        <h3>Beginner Friendly</h3>
                        <p>Discover projects with good-first-issue labels</p>
                    </div>
                    <div className="feature-card fade-in">
                        <div className="feature-icon">⭐</div>
                        <h3>Quality Projects</h3>
                        <p>Curated from popular and active repositories</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}

export default HomePage;
