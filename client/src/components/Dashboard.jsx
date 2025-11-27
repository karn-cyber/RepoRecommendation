import { useState, useEffect } from 'react';
import { Github, Activity, Package, Star, Flame, GitPullRequest, GitCommit, AlertCircle, Users, Code, Trophy, Target } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import CombinedHeatmap from './CombinedHeatmap';
import './Dashboard.css';

function Dashboard() {
    const [contributionData, setContributionData] = useState(null);
    const [leetcodeData, setLeetcodeData] = useState(null);
    const [codeforcesData, setCodeforcesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    // DSA Usernames
    const [leetcodeUsername, setLeetcodeUsername] = useState('');
    const [codeforcesHandle, setCodeforcesHandle] = useState('');
    const [isEditingProfiles, setIsEditingProfiles] = useState(false);

    useEffect(() => {
        // Check for OAuth token in URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            setAccessToken(token);
            localStorage.setItem('github_token', token);
            window.history.replaceState({}, '', '/dashboard');
            fetchContributions(token);
        } else {
            const storedToken = localStorage.getItem('github_token');
            if (storedToken) {
                setAccessToken(storedToken);
                fetchContributions(storedToken);
            } else {
                setLoading(false);
            }
        }

        // Load stored DSA profiles
        const storedLC = localStorage.getItem('leetcode_username');
        const storedCF = localStorage.getItem('codeforces_handle');
        if (storedLC) {
            setLeetcodeUsername(storedLC);
            fetchLeetCode(storedLC);
        }
        if (storedCF) {
            setCodeforcesHandle(storedCF);
            fetchCodeforces(storedCF);
        }
    }, []);

    const fetchContributions = async (token) => {
        setLoading(true);
        setError(null);
        try {
            const userResponse = await fetch('https://api.github.com/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!userResponse.ok) throw new Error('Failed to authenticate');
            const user = await userResponse.json();

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(`/api/github/contributions/${user.login}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error('Failed to fetch contribution data');
            const data = await response.json();
            setContributionData(data.data);
        } catch (err) {
            console.error('Error fetching contributions:', err);
            if (err.name !== 'AbortError') setError(err.message);
            // Clear invalid token only if it's not an AbortError
            if (err.name !== 'AbortError' && err.message === 'Failed to authenticate') {
                localStorage.removeItem('github_token');
                setAccessToken(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchLeetCode = async (username) => {
        try {
            const res = await fetch(`/api/leetcode/${username}`);
            if (res.ok) {
                const data = await res.json();
                setLeetcodeData(data);
            }
        } catch (err) {
            console.error('LeetCode fetch error:', err);
        }
    };

    const fetchCodeforces = async (handle) => {
        try {
            const res = await fetch(`/api/codeforces/${handle}`);
            if (res.ok) {
                const data = await res.json();
                setCodeforcesData(data);
            }
        } catch (err) {
            console.error('Codeforces fetch error:', err);
        }
    };

    const handleSaveProfiles = () => {
        if (leetcodeUsername) {
            localStorage.setItem('leetcode_username', leetcodeUsername);
            fetchLeetCode(leetcodeUsername);
        }
        if (codeforcesHandle) {
            localStorage.setItem('codeforces_handle', codeforcesHandle);
            fetchCodeforces(codeforcesHandle);
        }
        setIsEditingProfiles(false);
    };

    const handleConnect = async () => {
        try {
            const response = await fetch('/api/github/oauth/authorize');
            const data = await response.json();
            if (data.authUrl) window.location.href = data.authUrl;
            else setError('GitHub OAuth not configured. Please add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to .env file.');
        } catch (err) {
            setError('Failed to initiate GitHub connection');
        }
    };

    const handleDisconnect = () => {
        localStorage.removeItem('github_token');
        setAccessToken(null);
        setContributionData(null);
    };

    // Helper to merge activity data
    const getCombinedActivity = () => {
        const activityMap = {};

        // GitHub
        contributionData?.contributionCalendar?.forEach(day => {
            if (day.count > 0) activityMap[day.date] = (activityMap[day.date] || 0) + day.count;
        });

        // LeetCode (submissionCalendar is unix timestamp -> count)
        if (leetcodeData?.matchedUser?.submissionCalendar) {
            const calendar = JSON.parse(leetcodeData.matchedUser.submissionCalendar);
            Object.entries(calendar).forEach(([timestamp, count]) => {
                const date = new Date(parseInt(timestamp) * 1000).toISOString().split('T')[0];
                activityMap[date] = (activityMap[date] || 0) + count;
            });
        }

        // Codeforces
        codeforcesData?.submissions?.forEach(sub => {
            const date = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
            activityMap[date] = (activityMap[date] || 0) + 1;
        });

        return activityMap;
    };

    const getTotalSolved = () => {
        let total = 0;
        // LeetCode
        if (leetcodeData?.matchedUser?.submitStats?.acSubmissionNum) {
            const all = leetcodeData.matchedUser.submitStats.acSubmissionNum.find(s => s.difficulty === 'All');
            total += all ? all.count : 0;
        }
        // Codeforces
        if (codeforcesData?.submissions) {
            const solved = new Set(codeforcesData.submissions.filter(s => s.verdict === 'OK').map(s => s.problem.name));
            total += solved.size;
        }
        return total;
    };

    if (loading) return <div className="dashboard-page"><div className="loading-container"><div className="spinner"></div><p className="loading-text">Loading dashboard...</p></div></div>;
    if (error) return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="error-state">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>Try Again</button>
                </div>
            </div>
        </div>
    );
    if (!accessToken || !contributionData) return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="connect-prompt fade-in">
                    <div className="connect-icon">
                        <Github size={80} strokeWidth={1.5} />
                    </div>
                    <h1 className="connect-title">Connect to GitHub</h1>
                    <p className="connect-subtitle">Link your account to view your developer profile.</p>
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

    const stats = contributionData?.stats || {};
    const languages = contributionData?.languages || [];

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header fade-in">
                    <div className="profile-section">
                        <img src={contributionData.avatarUrl} alt={contributionData.username} className="profile-avatar" />
                        <div>
                            <h1 className="dashboard-title">{contributionData.name || contributionData.username}</h1>
                            <p className="dashboard-subtitle">@{contributionData.username}</p>
                            {contributionData.bio && <p className="profile-bio">{contributionData.bio}</p>}
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-secondary" onClick={() => setIsEditingProfiles(!isEditingProfiles)}>
                            {isEditingProfiles ? 'Close Settings' : 'Connect DSA Accounts'}
                        </button>
                        <button className="btn btn-secondary disconnect-btn" onClick={handleDisconnect}>Disconnect</button>
                    </div>
                </div>

                {isEditingProfiles && (
                    <div className="dsa-connect-section fade-in">
                        <h3>Connect Coding Profiles</h3>
                        <div className="dsa-inputs">
                            <div className="input-group">
                                <label>LeetCode Username</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={leetcodeUsername}
                                    onChange={(e) => setLeetcodeUsername(e.target.value)}
                                    placeholder="e.g. neelanshu"
                                />
                            </div>
                            <div className="input-group">
                                <label>Codeforces Handle</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={codeforcesHandle}
                                    onChange={(e) => setCodeforcesHandle(e.target.value)}
                                    placeholder="e.g. tourist"
                                />
                            </div>
                            <button className="btn btn-primary" onClick={handleSaveProfiles}>Save Profiles</button>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="stats-grid fade-in">
                    {/* 1. Total Problems Solved (CF + LC) */}
                    <div className="stat-card highlight-card">
                        <div className="stat-icon"><Trophy size={32} strokeWidth={1.5} /></div>
                        <div className="stat-content">
                            <p className="stat-label">Total Problems Solved</p>
                            <p className="stat-value">{getTotalSolved().toLocaleString()}</p>
                            <p className="stat-subtext">LeetCode + Codeforces</p>
                        </div>
                    </div>

                    {/* 2. Total Contributions (Github) */}
                    <div className="stat-card">
                        <div className="stat-icon"><Activity size={32} strokeWidth={1.5} /></div>
                        <div className="stat-content">
                            <p className="stat-label">Total Contributions</p>
                            <p className="stat-value">{stats?.totalContributions?.toLocaleString() || 0}</p>
                            <p className="stat-subtext">GitHub Activity</p>
                        </div>
                    </div>

                    {/* 3. Pull Requests */}
                    <div className="stat-card">
                        <div className="stat-icon"><GitPullRequest size={32} strokeWidth={1.5} /></div>
                        <div className="stat-content">
                            <p className="stat-label">Pull Requests</p>
                            <p className="stat-value">{stats?.totalPullRequests?.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    {/* 4. LeetCode Problem Solved */}
                    <div className="stat-card">
                        <div className="stat-icon"><Code size={32} strokeWidth={1.5} /></div>
                        <div className="stat-content">
                            <p className="stat-label">LeetCode Solved</p>
                            <p className="stat-value">
                                {leetcodeData?.matchedUser?.submitStats?.acSubmissionNum.find(s => s.difficulty === 'All')?.count || (leetcodeUsername ? '0' : '-')}
                            </p>
                            {!leetcodeUsername && <p className="stat-subtext">Not Connected</p>}
                        </div>
                    </div>

                    {/* 5. Codeforces Problem Solved */}
                    <div className="stat-card">
                        <div className="stat-icon"><Target size={32} strokeWidth={1.5} /></div>
                        <div className="stat-content">
                            <p className="stat-label">Codeforces Solved</p>
                            <p className="stat-value">
                                {codeforcesData?.submissions ?
                                    new Set(codeforcesData.submissions.filter(s => s.verdict === 'OK').map(s => s.problem.name)).size
                                    : (codeforcesHandle ? '0' : '-')}
                            </p>
                            {!codeforcesHandle && <p className="stat-subtext">Not Connected</p>}
                        </div>
                    </div>

                    {/* 6. LeetCode Rating */}
                    <div className="stat-card">
                        <div className="stat-icon"><Flame size={32} strokeWidth={1.5} /></div>
                        <div className="stat-content">
                            <p className="stat-label">LeetCode Rating</p>
                            <p className="stat-value">
                                {leetcodeData?.userContestRanking?.rating ? Math.round(leetcodeData.userContestRanking.rating) : '-'}
                            </p>
                            <p className="stat-subtext">Contest Rating</p>
                        </div>
                    </div>

                    {/* 7. Codeforces Rating */}
                    <div className="stat-card">
                        <div className="stat-icon"><Star size={32} strokeWidth={1.5} /></div>
                        <div className="stat-content">
                            <p className="stat-label">Codeforces Rating</p>
                            <p className="stat-value">{codeforcesData?.userInfo?.rating || '-'}</p>
                            <p className="stat-subtext">{codeforcesData?.userInfo?.rank || 'Unrated'}</p>
                        </div>
                    </div>
                </div>

                {/* Combined Activity Heatmap */}
                <div className="dashboard-section fade-in">
                    <h2 className="section-title">Combined Activity Graph</h2>
                    <p className="section-subtitle">Visualizing your coding streak across GitHub, LeetCode, and Codeforces.</p>
                    <CombinedHeatmap data={getCombinedActivity()} />
                </div>

                {/* Language Visualization */}
                <div className="dashboard-grid">
                    <div className="dashboard-section fade-in radar-section">
                        <h2 className="section-title">Language Distribution</h2>
                        <div className="radar-container">
                            <ResponsiveContainer width="100%" height={350}>
                                <RadarChart data={languages}>
                                    <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                                    <PolarAngleAxis dataKey="name" tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }} />
                                    <Radar name="Usage" dataKey="percentage" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
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
