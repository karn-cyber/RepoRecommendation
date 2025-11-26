import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RepositoryCard from './RepositoryCard';
import './ResultsPage.css';

function ResultsPage({ skills, repositories, loading }) {
    const navigate = useNavigate();
    return (
        <div className="results-page">
            <div className="results-header">
                <div className="container">
                    <button className="btn btn-secondary back-btn" onClick={() => navigate('/')}>
                        <ArrowLeft size={20} />
                        Back to Search
                    </button>

                    <div className="results-title-section">
                        <h1 className="results-title">
                            Repositories for
                            <span className="gradient-text"> {skills.join(', ')}</span>
                        </h1>
                        {!loading && repositories.length > 0 && (
                            <p className="results-count">
                                Found {repositories.length} repositor{repositories.length !== 1 ? 'ies' : 'y'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="container">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p className="loading-text">Searching for amazing projects...</p>
                    </div>
                ) : repositories.length > 0 ? (
                    <div className="repositories-grid">
                        {repositories.map((repo) => (
                            <RepositoryCard key={repo.id} repository={repo} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h2>No Repositories Found</h2>
                        <p>Try adjusting your skills or search again</p>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            New Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResultsPage;
