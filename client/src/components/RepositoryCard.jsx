import { Star, GitFork, AlertCircle } from 'lucide-react';
import './RepositoryCard.css';

function RepositoryCard({ repository }) {
    const {
        name,
        fullName,
        description,
        url,
        stars,
        forks,
        language,
        topics,
        openIssues,
        updatedAt
    } = repository;

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays}d ago`;
        } else if (diffDays < 365) {
            return `${Math.floor(diffDays / 30)}mo ago`;
        } else {
            return `${Math.floor(diffDays / 365)}y ago`;
        }
    };

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="repository-card card"
        >
            <div className="repo-header">
                <h3 className="repo-name">{name}</h3>
                {language && (
                    <span className="repo-language">
                        <span className="language-dot"></span>
                        {language}
                    </span>
                )}
            </div>

            <p className="repo-full-name">{fullName}</p>

            {description && (
                <p className="repo-description">{description}</p>
            )}

            {topics && topics.length > 0 && (
                <div className="repo-topics">
                    {topics.slice(0, 3).map((topic, index) => (
                        <span key={index} className="topic-tag">
                            {topic}
                        </span>
                    ))}
                    {topics.length > 3 && (
                        <span className="topic-tag">+{topics.length - 3}</span>
                    )}
                </div>
            )}

            <div className="repo-stats">
                <div className="stat">
                    <Star size={16} />
                    {formatNumber(stars)}
                </div>
                <div className="stat">
                    <GitFork size={16} />
                    {formatNumber(forks)}
                </div>
                <div className="stat">
                    <AlertCircle size={16} />
                    {openIssues} issues
                </div>
                <div className="stat updated">
                    Updated {formatDate(updatedAt)}
                </div>
            </div>
        </a>
    );
}

export default RepositoryCard;
