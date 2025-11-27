const express = require('express');
const axios = require('axios');
const router = express.Router();

// GitHub API configuration
const GITHUB_API_URL = 'https://api.github.com/search/repositories';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Helper function to search repositories by skill with difficulty level
async function searchRepositoriesBySkill(skill, difficultyLevel = 'all') {
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Repo-Finder-App'
        };

        // Add authorization if token is available
        if (GITHUB_TOKEN) {
            headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        }

        // Map skills to correct search qualifiers
        const SKILL_MAPPINGS = {
            'node.js': 'topic:nodejs',
            'nodejs': 'topic:nodejs',
            'angular': 'topic:angular',
            'react': 'topic:react',
            'vue': 'topic:vue',
            'next.js': 'topic:nextjs',
            'express': 'topic:express',
            'django': 'topic:django',
            'flask': 'topic:flask',
            'spring': 'topic:spring',
            'laravel': 'topic:laravel',
            'dotnet': 'topic:dotnet',
            '.net': 'topic:dotnet',
            'c++': 'language:cpp',
            'c#': 'language:csharp'
        };

        const normalizedSkill = skill.toLowerCase().trim();
        let query = SKILL_MAPPINGS[normalizedSkill] || `language:${skill}`;

        // Add difficulty-specific filters
        if (difficultyLevel === 'beginner') {
            query += ' label:good-first-issue,help-wanted';
        } else if (difficultyLevel === 'intermediate') {
            query += ' stars:100..1000'; // Moderate popularity
        } else if (difficultyLevel === 'advanced') {
            query += ' stars:>1000'; // Popular projects
        }
        // For 'all', no additional filters

        // Fetch multiple pages to get more results
        const maxPages = 3; // Fetch up to 3 pages (300 total repos max)
        const allRepos = [];

        for (let page = 1; page <= maxPages; page++) {
            try {
                const response = await axios.get(GITHUB_API_URL, {
                    headers,
                    params: {
                        q: query,
                        sort: 'stars',
                        order: 'desc',
                        per_page: 100, // GitHub API maximum
                        page: page
                    }
                });

                const repos = response.data.items.map(repo => ({
                    id: repo.id,
                    name: repo.name,
                    fullName: repo.full_name,
                    description: repo.description,
                    url: repo.html_url,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    language: repo.language,
                    topics: repo.topics || [],
                    openIssues: repo.open_issues_count,
                    updatedAt: repo.updated_at,
                    owner: {
                        login: repo.owner.login,
                        avatar: repo.owner.avatar_url
                    }
                }));

                allRepos.push(...repos);

                // If we got fewer results than requested, we've reached the end
                if (response.data.items.length < 100) {
                    break;
                }

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (pageError) {
                console.error(`Error fetching page ${page}:`, pageError.message);
                // Continue with what we have
                break;
            }
        }

        return allRepos;
    } catch (error) {
        console.error(`Error searching for ${skill}:`, error.message);
        return [];
    }
}

// POST endpoint to get repositories based on skills
router.post('/repositories', async (req, res) => {
    try {
        const { skills, difficultyLevel } = req.body;

        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({
                error: 'Please provide at least one skill'
            });
        }

        // Validate difficulty level
        const validLevels = ['all', 'beginner', 'intermediate', 'advanced'];
        const level = validLevels.includes(difficultyLevel) ? difficultyLevel : 'all';

        // Search repositories for each skill with difficulty level
        const searchPromises = skills.map(skill =>
            searchRepositoriesBySkill(skill.toLowerCase(), level)
        );

        const results = await Promise.all(searchPromises);

        // Flatten and deduplicate results
        const allRepos = results.flat();
        const uniqueRepos = Array.from(
            new Map(allRepos.map(repo => [repo.id, repo])).values()
        );

        // Sort by stars descending
        uniqueRepos.sort((a, b) => b.stars - a.stars);

        res.json({
            success: true,
            count: uniqueRepos.length,
            difficultyLevel: level,
            repositories: uniqueRepos.slice(0, 100) // Return up to 100 repos
        });

    } catch (error) {
        console.error('Error in /api/repositories:', error);
        res.status(500).json({
            error: 'Failed to fetch repositories',
            message: error.message
        });
    }
});

// POST endpoint for direct GitHub repository search
router.post('/search', async (req, res) => {
    try {
        const { query, language, minStars, sort } = req.body;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                error: 'Please provide a search query'
            });
        }

        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Repo-Finder-App'
        };

        if (GITHUB_TOKEN) {
            headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        }

        // Build search query
        let searchQuery = query.trim();
        if (language) {
            searchQuery += ` language:${language}`;
        }
        if (minStars) {
            searchQuery += ` stars:>=${minStars}`;
        }

        const response = await axios.get(GITHUB_API_URL, {
            headers,
            params: {
                q: searchQuery,
                sort: sort || 'stars',
                order: 'desc',
                per_page: 100 // Increased to GitHub API maximum
            }
        });

        const repositories = response.data.items.map(repo => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            topics: repo.topics || [],
            openIssues: repo.open_issues_count,
            updatedAt: repo.updated_at,
            owner: {
                login: repo.owner.login,
                avatar: repo.owner.avatar_url
            }
        }));

        res.json({
            success: true,
            count: repositories.length,
            total: response.data.total_count,
            repositories
        });

    } catch (error) {
        console.error('Error in /api/search:', error);
        res.status(500).json({
            error: 'Failed to search repositories',
            message: error.message
        });
    }
});

// GET endpoint for user contribution stats (demo with mock data)
router.get('/contributions/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Mock data for demo - in production, this would call GitHub GraphQL API
        const mockData = {
            username: username,
            avatarUrl: `https://github.com/${username}.png`,
            stats: {
                totalContributions: 1247,
                totalRepositories: 42,
                totalStars: 3456,
                totalForks: 789,
                contributionStreak: 45
            },
            recentContributions: [
                {
                    repo: 'facebook/react',
                    type: 'Pull Request',
                    title: 'Fix: Memory leak in useEffect hook',
                    date: '2024-01-20',
                    status: 'merged'
                },
                {
                    repo: 'vuejs/vue',
                    type: 'Issue',
                    title: 'Feature request: Add TypeScript support',
                    date: '2024-01-18',
                    status: 'open'
                },
                {
                    repo: 'microsoft/vscode',
                    type: 'Pull Request',
                    title: 'Improve syntax highlighting for JSX',
                    date: '2024-01-15',
                    status: 'merged'
                }
            ],
            languages: [
                { name: 'JavaScript', percentage: 45 },
                { name: 'TypeScript', percentage: 30 },
                { name: 'Python', percentage: 15 },
                { name: 'Go', percentage: 10 }
            ],
            contributionCalendar: generateMockCalendar()
        };

        res.json({
            success: true,
            data: mockData
        });

    } catch (error) {
        console.error('Error in /api/contributions:', error);
        res.status(500).json({
            error: 'Failed to fetch contributions',
            message: error.message
        });
    }
});

// Helper function to generate mock contribution calendar data
function generateMockCalendar() {
    const calendar = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        calendar.push({
            date: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 15)
        });
    }

    return calendar;
}

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'API is running' });
});

// GitHub OAuth initiation
router.get('/github/oauth/authorize', (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;
    const scope = 'read:user user:email read:org';

    if (!clientId) {
        return res.status(500).json({ error: 'GitHub OAuth not configured' });
    }

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    res.json({ authUrl: githubAuthUrl });
});

// GitHub OAuth callback
router.get('/github/oauth/callback', async (req, res) => {
    const { code } = req.query;
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!code) {
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        return res.redirect(`${clientUrl}?error=no_code`);
    }

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: clientId,
                client_secret: clientSecret,
                code: code
            },
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.redirect('http://localhost:5173?error=no_token');
        }

        // Redirect back to frontend
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(`${clientUrl}/dashboard?token=${accessToken}`);
    } catch (error) {
        console.error('OAuth error:', error);
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(`${clientUrl}?error=oauth_failed`);
    }
});

// Get real contribution data using GitHub GraphQL API
router.get('/github/contributions/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const token = req.headers.authorization?.replace('Bearer ', '');

        console.log('=== Contribution Fetch Request ===');
        console.log('Username:', username);
        console.log('Token present:', !!token);

        if (!token) {
            console.error('No token provided');
            return res.status(401).json({ error: 'Authorization token required' });
        }

        // GraphQL query for contribution data
        // Simplified to current year only for better performance
        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01T00:00:00Z`;
        const endDate = `${currentYear}-12-31T23:59:59Z`;

        console.log('Fetching data from:', startDate, 'to:', endDate);

        const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          name
          login
          avatarUrl
          bio
          createdAt
          followers {
            totalCount
          }
          following {
            totalCount
          }
          gists {
            totalCount
          }
          organizations(first: 10) {
            nodes {
              name
              login
              avatarUrl
              description
            }
          }
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
          repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
            totalCount
            nodes {
              name
              stargazerCount
              primaryLanguage {
                name
              }
            }
          }
          repositoriesContributedTo(first: 100, contributionTypes: [COMMIT, PULL_REQUEST, ISSUE]) {
            totalCount
          }
          starredRepositories {
            totalCount
          }
        }
      }
    `;

        console.log('Sending GraphQL request to GitHub...');
        const response = await axios.post(
            'https://api.github.com/graphql',
            {
                query,
                variables: {
                    username,
                    from: startDate,
                    to: endDate
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('GraphQL response received, status:', response.status);

        if (response.data.errors) {
            console.error('GraphQL errors:', JSON.stringify(response.data.errors, null, 2));
            return res.status(400).json({ error: 'Failed to fetch data', details: response.data.errors });
        }

        const userData = response.data.data.user;

        if (!userData) {
            console.error('User data not found in response');
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('User data received for:', userData.login);

        // Calculate language statistics with repository counts
        const languageStats = {};
        userData.repositories.nodes.forEach(repo => {
            if (repo.primaryLanguage) {
                const lang = repo.primaryLanguage.name;
                languageStats[lang] = (languageStats[lang] || 0) + 1;
            }
        });

        const totalRepos = Object.values(languageStats).reduce((a, b) => a + b, 0);
        const languages = Object.entries(languageStats)
            .map(([name, count]) => ({
                name,
                count,  // Number of repositories using this language
                percentage: Math.round((count / totalRepos) * 100)
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 6); // Top 6 languages for radar chart

        // Format contribution calendar (current year only)
        const contributionCalendar = [];
        userData.contributionsCollection.contributionCalendar.weeks.forEach(week => {
            week.contributionDays.forEach(day => {
                contributionCalendar.push({
                    date: day.date,
                    count: day.contributionCount
                });
            });
        });

        // Calculate total stars
        const totalStars = userData.repositories.nodes.reduce(
            (sum, repo) => sum + repo.stargazerCount,
            0
        );

        // Format response
        const formattedData = {
            username: userData.login,
            name: userData.name,
            avatarUrl: userData.avatarUrl,
            bio: userData.bio,
            createdAt: userData.createdAt,
            followers: userData.followers.totalCount,
            following: userData.following.totalCount,
            publicGists: userData.gists.totalCount,
            organizations: userData.organizations.nodes.map(org => ({
                name: org.name,
                login: org.login,
                avatarUrl: org.avatarUrl,
                description: org.description
            })),
            stats: {
                totalContributions: userData.contributionsCollection.contributionCalendar.totalContributions,
                totalCommits: userData.contributionsCollection.totalCommitContributions,
                totalPullRequests: userData.contributionsCollection.totalPullRequestContributions,
                totalIssues: userData.contributionsCollection.totalIssueContributions,
                totalRepositories: userData.repositories.totalCount,
                contributedRepositories: userData.repositoriesContributedTo.totalCount,
                totalStars: totalStars,
                contributionStreak: calculateStreak(contributionCalendar)
            },
            languages,
            contributionCalendar,
            recentContributions: [] // Would need additional API calls for detailed PR/Issue data
        };

        console.log('Successfully formatted data, sending response');
        res.json({
            success: true,
            data: formattedData
        });

    } catch (error) {
        console.error('=== Error in contribution fetch ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.response) {
            console.error('API Response status:', error.response.status);
            console.error('API Response data:', JSON.stringify(error.response.data, null, 2));
        }
        res.status(500).json({
            error: 'Failed to fetch contribution data',
            message: error.message,
            details: error.response?.data
        });
    }
});

// Helper function to calculate contribution streak
function calculateStreak(calendar) {
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];

    // Reverse to start from most recent
    const reversedCalendar = [...calendar].reverse();

    for (const day of reversedCalendar) {
        if (day.count > 0) {
            currentStreak++;
        } else if (day.date < today) {
            // Only break streak if it's a past day with 0 contributions
            break;
        }
    }

    return currentStreak;
}

// LeetCode API Proxy
router.get('/leetcode/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const query = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                    submitStats: submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                            submissions
                        }
                    }
                    submissionCalendar
                }
                userContestRanking(username: $username) {
                    rating
                    globalRanking
                }
                allQuestionsCount {
                    difficulty
                    count
                }
            }
        `;

        const response = await axios.post('https://leetcode.com/graphql', {
            query,
            variables: { username }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com'
            }
        });

        if (response.data.errors) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(response.data.data);
    } catch (error) {
        console.error('LeetCode API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch LeetCode data' });
    }
});

// Codeforces API Proxy
router.get('/codeforces/:handle', async (req, res) => {
    const { handle } = req.params;
    try {
        // Fetch user info
        const userResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        // Fetch user submissions
        const subsResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`);

        if (userResponse.data.status !== 'OK' || subsResponse.data.status !== 'OK') {
            throw new Error('Codeforces API error');
        }

        res.json({
            userInfo: userResponse.data.result[0],
            submissions: subsResponse.data.result
        });
    } catch (error) {
        console.error('Codeforces API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch Codeforces data' });
    }
});

// Daily DSA Problems Endpoint
router.get('/dsa/daily', (req, res) => {
    // In a real app, this could fetch from a database or rotate daily
    const problems = {
        leetcode: [
            { title: "Two Sum", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/" },
            { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
            { title: "Median of Two Sorted Arrays", difficulty: "Hard", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" }
        ],
        codeforces: [
            { title: "Watermelon", difficulty: "800", url: "https://codeforces.com/problemset/problem/4/A" },
            { title: "Theatre Square", difficulty: "1000", url: "https://codeforces.com/problemset/problem/1/A" }
        ]
    };
    res.json(problems);
});

module.exports = router;
