import { useState, useEffect } from 'react';
import { Github, Activity, Package, Star, Flame, GitPullRequest, GitCommit, AlertCircle, Users } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import './Dashboard.css';

function Dashboard() {
    const [contributionData, setContributionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        // Check for OAuth token in URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            // Store token and remove from URL
            setAccessToken(token);
            localStorage.setItem('github_token', token);
            window.history.replaceState({}, '', '/dashboard');
            fetchContributions(token);
        } else {
            // Check for stored token
            const storedToken = localStorage.getItem('github_token');
            if (storedToken) {
                setAccessToken(storedToken);
                fetchContributions(storedToken);
            } else {
                setLoading(false);
            }
        }
    }, []);

    const fetchContributions = async (token) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching GitHub user data...');
            // First, get the authenticated user's username
            const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!userResponse.ok) {
                throw new Error('Failed to authenticate');
            }

            const user = await userResponse.json();
            console.log('User authenticated:', user.login);

            // Now fetch contribution data using our GraphQL endpoint with timeout
            console.log('Fetching contribution data (this may take 10-20 seconds)...');

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch(`/api/github/contributions/${user.login}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error('Failed to fetch contribution data');
            }

            const data = await response.json();
            console.log('Contribution data received:', data);
            setContributionData(data.data);
        } catch (err) {
            console.error('Error fetching contributions:', err);
            if (err.name === 'AbortError') {
                setError('Request timed out. GitHub API is taking too long to respond. Please try again.');
            } else {
                setError(err.message);
            }
            // Clear invalid token
            localStorage.removeItem('github_token');
            setAccessToken(null);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        try {
            const response = await fetch('/api/github/oauth/authorize');
            const data = await response.json();

            if (data.authUrl) {
                window.location.href = data.authUrl;
            } else {
                setError('GitHub OAuth not configured. Please add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to .env file.');
            }
        } catch (err) {
            setError('Failed to initiate GitHub connection');
        }
    };

    const handleDisconnect = () => {
        localStorage.removeItem('github_token');
        setAccessToken(null);
        setContributionData(null);
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-container">
                    <div className="error-state">
                        <h2>Error</h2>
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={() => window.location.reload()}>
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!accessToken || !contributionData) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-container">
                    <div className="connect-prompt fade-in">
                        <div className="connect-icon">
                            <Github size={80} strokeWidth={1.5} />
                        </div>
                        <h1 className="connect-title">Connect to GitHub</h1>
                        <p className="connect-subtitle">
                            Link your GitHub account to view your real contributions, statistics, and activity.
                        </p>
                        <button className="btn btn-primary connect-btn" onClick={handleConnect}>
                            <Github size={20} />
                            Connect GitHub Account
                        </button>
                        <p className="connect-note">
                            <strong>Secure OAuth:</strong> Your credentials are never stored. We use GitHub's official OAuth flow.
                            You'll be redirected to GitHub to authorize access, then brought back here.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Safely destructure after confirming data exists
    const stats = contributionData?.stats || {};
    const languages = contributionData?.languages || [];
    const contributionCalendar = contributionData?.contributionCalendar || [];

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header fade-in">
                    <div className="profile-section">
                        <img
                            src={contributionData.avatarUrl}
                            alt={contributionData.username}
                            className="profile-avatar"
                        />
                        <div>
                            <h1 className="dashboard-title">
                                {contributionData.name || contributionData.username}
                            </h1>
                            <p className="dashboard-subtitle">@{contributionData.username}</p>
                            {contributionData.bio && <p className="profile-bio">{contributionData.bio}</p>}
                        </div>
                    </div>
                    <button className="btn btn-secondary disconnect-btn" onClick={handleDisconnect}>
                        Disconnect
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid fade-in">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Activity size={32} strokeWidth={1.5} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Contributions</p>
                            <p className="stat-value">{stats?.totalContributions?.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <GitCommit size={32} strokeWidth={1.5} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Commits</p>
                            <p className="stat-value">{stats?.totalCommits?.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <GitPullRequest size={32} strokeWidth={1.5} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Pull Requests</p>
                            <p className="stat-value">{stats?.totalPullRequests?.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <AlertCircle size={32} strokeWidth={1.5} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Issues</p>
                            <p className="stat-value">{stats?.totalIssues?.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <Package size={32} strokeWidth={1.5} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Repositories</p>
                            <p className="stat-value">{stats?.totalRepositories || 0}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <Star size={32} strokeWidth={1.5} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Stars</p>
                            <p className="stat-value">{stats?.totalStars?.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <Flame size={32} strokeWidth={1.5} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Contribution Streak</p>
                            <p className="stat-value">{stats?.contributionStreak || 0} days</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <Users size={32} strokeWidth={1.5} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Followers</p>
                            <p className="stat-value">{contributionData.followers?.toLocaleString() || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Organizations Section */}
                {contributionData.organizations && contributionData.organizations.length > 0 && (
                    <div className="dashboard-section organizations-section fade-in">
                        <h2 className="section-title">
                            Organizations ({contributionData.organizations.length})
                        </h2>
                        <div className="organizations-grid">
                            {contributionData.organizations.map((org, index) => (
                                <a
                                    key={index}
                                    href={`https://github.com/${org.login}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="organization-card"
                                    title={org.description || org.name}
                                >
                                    <img
                                        src={org.avatarUrl}
                                        alt={org.name}
                                        className="org-avatar"
                                    />
                                    <div className="org-info">
                                        <span className="org-name">{org.name}</span>
                                        <span className="org-badge">Member</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Language Visualization & Details */}
                <div className="dashboard-grid">
                    <div className="dashboard-section fade-in radar-section">
                        <h2 className="section-title">Language Distribution</h2>
                        <div className="radar-container">
                            <ResponsiveContainer width="100%" height={350}>
                                <RadarChart data={languages}>
                                    <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                                    <PolarAngleAxis
                                        dataKey="name"
                                        tick={({ x, y, textAnchor, value, index }) => {
                                            const lang = languages[index];
                                            if (!lang) return null;
                                            return (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    textAnchor={textAnchor}
                                                    fill="rgba(255, 255, 255, 0.7)"
                                                    fontSize={12}
                                                    fontWeight={500}
                                                >
                                                    <tspan>{lang.count} {lang.count === 1 ? 'repo' : 'repos'}</tspan>
                                                    <tspan x={x} dy="1.2em" fill="rgba(255, 255, 255, 0.5)" fontSize={11}>
                                                        {lang.name}
                                                    </tspan>
                                                </text>
                                            );
                                        }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 15, 25, 0.95)',
                                            border: '1px solid rgba(99, 102, 241, 0.3)',
                                            borderRadius: '8px',
                                            padding: '8px 12px'
                                        }}
                                        labelStyle={{ color: 'rgba(255, 255, 255, 0.9)' }}
                                        itemStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    />
                                    <Radar
                                        name="Usage"
                                        dataKey="percentage"
                                        stroke="rgba(99, 102, 241, 1)"
                                        fill="rgba(99, 102, 241, 0.5)"
                                        strokeWidth={2}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Language Stats */}
                    <div className="dashboard-section fade-in">
                        <h2 className="section-title">Top Languages</h2>
                        <div className="languages-list">
                            {languages && languages.length > 0 ? (
                                languages.map((lang, index) => (
                                    <div key={index} className="language-item">
                                        <div className="language-header">
                                            <span className="language-name">{lang.name}</span>
                                            <span className="language-percentage">{lang.percentage}% • {lang.count} {lang.count === 1 ? 'repo' : 'repos'}</span>
                                        </div>
                                        <div className="language-bar">
                                            <div
                                                className="language-fill"
                                                style={{
                                                    width: `${lang.percentage}%`,
                                                    background: getLanguageColor(lang.name)
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="empty-message">No language data available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contribution Calendar */}
                <div className="dashboard-section fade-in">
                    <h2 className="section-title">Contribution Activity (Past Year)</h2>
                    <div className="contribution-calendar">
                        {contributionCalendar && contributionCalendar.slice(0, 365).map((day, index) => (
                            <div
                                key={index}
                                className="calendar-day"
                                style={{
                                    backgroundColor: getContributionColor(day.count)
                                }}
                                title={`${day.date}: ${day.count} contributions`}
                            ></div>
                        ))}
                    </div>
                    <div className="calendar-legend">
                        <span>Less</span>
                        <div className="legend-scale">
                            {[0, 3, 6, 9, 12].map((count) => (
                                <div
                                    key={count}
                                    className="legend-box"
                                    style={{ backgroundColor: getContributionColor(count) }}
                                ></div>
                            ))}
                        </div>
                        <span>More</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper functions
function getLanguageColor(language) {
    const colors = {
        JavaScript: 'linear-gradient(135deg, #f7df1e 0%, #ff9800 100%)',
        TypeScript: 'linear-gradient(135deg, #3178c6 0%, #00bcd4 100%)',
        Python: 'linear-gradient(135deg, #3776ab 0%, #4caf50 100%)',
        Go: 'linear-gradient(135deg, #00add8 0%, #2196f3 100%)',
        Java: 'linear-gradient(135deg, #b07219 0%, #e76f00 100%)',
        'C++': 'linear-gradient(135deg, #f34b7d 0%, #c178c1 100%)',
        Ruby: 'linear-gradient(135deg, #701516 0%, #cc342d 100%)',
        PHP: 'linear-gradient(135deg, #4F5D95 0%, #8892BF 100%)',
        default: 'var(--gradient-primary)'
    };
    return colors[language] || colors.default;
}

function getContributionColor(count) {
    if (count === 0) return 'rgba(255, 255, 255, 0.05)';
    if (count < 3) return 'rgba(99, 102, 241, 0.3)';
    if (count < 6) return 'rgba(99, 102, 241, 0.5)';
    if (count < 9) return 'rgba(99, 102, 241, 0.7)';
    return 'rgba(99, 102, 241, 1)';
}

export default Dashboard;
