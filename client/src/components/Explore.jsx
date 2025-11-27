import { useState } from 'react';
import { ExternalLink, Calendar, DollarSign, Users, Award } from 'lucide-react';
import './Explore.css';

const programs = [
    {
        id: 'gsoc',
        name: 'Google Summer of Code',
        shortName: 'GSoC',
        description: 'A global, online program focused on bringing new contributors into open source software development.',
        organization: 'Google',
        stipend: '$1,500 - $6,600',
        duration: '12-22 weeks',
        timeline: 'January - September',
        difficulty: 'Intermediate',
        eligibility: 'Students (18+ years)',
        link: 'https://summerofcode.withgoogle.com',
        color: '#4285F4',
        tags: ['Paid', 'Remote', 'Mentorship']
    },
    {
        id: 'lfx',
        name: 'Linux Foundation Mentorship',
        shortName: 'LFX',
        description: 'Helps developers with necessary skills to contribute to open source projects.',
        organization: 'Linux Foundation',
        stipend: '$3,000 - $6,600',
        duration: '12 weeks',
        timeline: 'Year-round (3 terms)',
        difficulty: 'All Levels',
        eligibility: 'Anyone',
        link: 'https://lfx.linuxfoundation.org/tools/mentorship',
        color: '#0066CC',
        tags: ['Paid', 'Remote', 'Year-round']
    },
    {
        id: 'outreachy',
        name: 'Outreachy',
        shortName: 'Outreachy',
        description: 'Provides internships to people subject to systemic bias and impacted by underrepresentation.',
        organization: 'Software Freedom Conservancy',
        stipend: '$7,000',
        duration: '13 weeks',
        timeline: 'May-August & December-March',
        difficulty: 'All Levels',
        eligibility: 'Underrepresented groups',
        link: 'https://www.outreachy.org',
        color: '#FF6B6B',
        tags: ['Paid', 'Remote', 'Diversity']
    },
    {
        id: 'mlh',
        name: 'MLH Fellowship',
        shortName: 'MLH',
        description: '12-week remote internship where participants earn a stipend and learn to collaborate on real open source projects.',
        organization: 'Major League Hacking',
        stipend: 'Varies',
        duration: '12 weeks',
        timeline: 'Spring, Summer, Fall',
        difficulty: 'Intermediate',
        eligibility: 'Students',
        link: 'https://fellowship.mlh.io',
        color: '#F1C40F',
        tags: ['Paid', 'Remote', 'Structured']
    },
    {
        id: 'gsod',
        name: 'Google Season of Docs',
        shortName: 'GSoD',
        description: 'Brings technical writers and open source projects together for a few months to work on documentation.',
        organization: 'Google',
        stipend: '$3,000 - $15,000',
        duration: '3-6 months',
        timeline: 'April - November',
        difficulty: 'Intermediate',
        eligibility: 'Technical Writers',
        link: 'https://developers.google.com/season-of-docs',
        color: '#34A853',
        tags: ['Paid', 'Remote', 'Documentation']
    },
    {
        id: 'sok',
        name: 'Season of KDE',
        shortName: 'SoK',
        description: 'Community outreach program for everyone to participate in KDE and open source.',
        organization: 'KDE',
        stipend: 'None (Certificate)',
        duration: '3 months',
        timeline: 'December - March',
        difficulty: 'Beginner Friendly',
        eligibility: 'Anyone',
        link: 'https://season.kde.org',
        color: '#1D99F3',
        tags: ['Free', 'Remote', 'Beginner Friendly']
    },
    {
        id: 'girlscript',
        name: 'GirlScript Summer of Code',
        shortName: 'GSSoC',
        description: '3-month long open source program for students to learn about open source.',
        organization: 'GirlScript Foundation',
        stipend: 'Swag & Certificates',
        duration: '3 months',
        timeline: 'May - August',
        difficulty: 'Beginner Friendly',
        eligibility: 'Students',
        link: 'https://gssoc.girlscript.tech',
        color: '#FF6F61',
        tags: ['Free', 'Remote', 'Beginner Friendly']
    },
    {
        id: 'hacktoberfest',
        name: 'Hacktoberfest',
        shortName: 'Hacktoberfest',
        description: 'Month-long celebration of open source software run by DigitalOcean.',
        organization: 'DigitalOcean',
        stipend: 'T-Shirt & Swag',
        duration: '1 month',
        timeline: 'October',
        difficulty: 'All Levels',
        eligibility: 'Anyone',
        link: 'https://hacktoberfest.com',
        color: '#FF8AE2',
        tags: ['Free', 'Remote', 'Annual Event']
    }
];

const dsaResources = [
    {
        id: 'leetcode',
        name: 'LeetCode',
        type: 'Platform',
        description: 'The leading platform for technical interview preparation with 2500+ questions.',
        link: 'https://leetcode.com',
        color: '#FFA116',
        tags: ['Interview Prep', 'DSA']
    },
    {
        id: 'codeforces',
        name: 'Codeforces',
        type: 'Platform',
        description: 'The most popular platform for competitive programming contests.',
        link: 'https://codeforces.com',
        color: '#1F8ACB',
        tags: ['Competitive Programming', 'Contests']
    },
    {
        id: 'icpc',
        name: 'ICPC',
        type: 'Competition',
        description: 'The oldest, largest, and most prestigious programming contest in the world.',
        link: 'https://icpc.global',
        color: '#5D4037',
        tags: ['Global', 'Team Contest']
    },
    {
        id: 'cp-algorithms',
        name: 'CP-Algorithms',
        type: 'Resource',
        description: 'Comprehensive translation of the famous E-Maxx algorithms website.',
        link: 'https://cp-algorithms.com',
        color: '#455A64',
        tags: ['Algorithms', 'Theory']
    },
    {
        id: 'meta-hackercup',
        name: 'Meta Hacker Cup',
        type: 'Competition',
        description: 'Meta\'s annual open programming competition.',
        link: 'https://www.facebook.com/codingcompetitions/hacker-cup',
        color: '#1877F2',
        tags: ['Annual', 'Cash Prizes']
    },
    {
        id: 'striver',
        name: 'Striver\'s A2Z Sheet',
        type: 'Resource',
        description: 'A complete roadmap to learn DSA from scratch to advanced.',
        link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2',
        color: '#D32F2F',
        tags: ['Roadmap', 'Free']
    }
];

const careerResources = [
    {
        id: 'fullstackopen',
        name: 'Full Stack Open',
        category: 'MERN Stack',
        description: 'Deep dive into modern web development with React, Redux, Node.js, MongoDB, and GraphQL.',
        link: 'https://fullstackopen.com/en/',
        color: '#000000',
        tags: ['React', 'Node.js', 'Free']
    },
    {
        id: 'odin',
        name: 'The Odin Project',
        category: 'Full Stack',
        description: 'A full stack curriculum is free and supported by a passionate open source community.',
        link: 'https://www.theodinproject.com',
        color: '#CC9543',
        tags: ['Web Dev', 'Project Based']
    },
    {
        id: 'roadmap-sh',
        name: 'Roadmap.sh',
        category: 'Career Path',
        description: 'Community driven roadmaps, articles and resources for developers.',
        link: 'https://roadmap.sh',
        color: '#2D3748',
        tags: ['Roadmaps', 'Guidance']
    },
    {
        id: 'fast-ai',
        name: 'Fast.ai',
        category: 'AI/ML',
        description: 'Making neural nets uncool again. A free course for coders.',
        link: 'https://www.fast.ai',
        color: '#364F6B',
        tags: ['Deep Learning', 'Practical']
    },
    {
        id: 'coursera-dl',
        name: 'Deep Learning Specialization',
        category: 'AI/ML',
        description: 'Andrew Ng\'s famous course to break into Artificial Intelligence.',
        link: 'https://www.coursera.org/specializations/deep-learning',
        color: '#0056D2',
        tags: ['Theory', 'Certification']
    },
    {
        id: 'system-design',
        name: 'System Design Primer',
        category: 'Internship Prep',
        description: 'Learn how to design large-scale systems. Prep for the system design interview.',
        link: 'https://github.com/donnemartin/system-design-primer',
        color: '#F48024',
        tags: ['Interview', 'Architecture']
    }
];

return (
    <div className="explore-page">
        <div className="explore-container">
            {/* Hero Section */}
            <div className="explore-hero fade-in">
                <h1 className="explore-title">Explore Opportunities & Resources</h1>
                <p className="explore-subtitle">
                    Curated paths for Open Source, Competitive Programming, and Career Growth.
                </p>
            </div>

            {/* Filter Section */}
            <div className="explore-filters fade-in">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Programs
                </button>
                <button
                    className={`filter-btn ${filter === 'paid' ? 'active' : ''}`}
                    onClick={() => setFilter('paid')}
                >
                    <DollarSign size={16} />
                    Paid
                </button>
                <button
                    className={`filter-btn ${filter === 'free' ? 'active' : ''}`}
                    onClick={() => setFilter('free')}
                >
                    Free
                </button>
                <button
                    className={`filter-btn ${filter === 'beginner' ? 'active' : ''}`}
                    onClick={() => setFilter('beginner')}
                >
                    Beginner Friendly
                </button>
            </div>

            {/* Open Source Programs Grid */}
            <h2 className="section-heading fade-in">Open Source Programs</h2>
            <div className="programs-grid">
                {filteredPrograms.map((program, index) => (
                    <div
                        key={program.id}
                        className="program-card fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="program-header" style={{ borderTopColor: program.color }}>
                            <div className="program-title-section">
                                <h2 className="program-name">{program.name}</h2>
                                <span className="program-org">{program.organization}</span>
                            </div>
                            <div className="program-logo" style={{ backgroundColor: program.color }}>
                                {program.shortName}
                            </div>
                        </div>

                        <p className="program-description">{program.description}</p>

                        <div className="program-details">
                            <div className="detail-item">
                                <DollarSign size={16} className="detail-icon" />
                                <span className="detail-label">Stipend:</span>
                                <span className="detail-value">{program.stipend}</span>
                            </div>
                            <div className="detail-item">
                                <Calendar size={16} className="detail-icon" />
                                <span className="detail-label">Timeline:</span>
                                <span className="detail-value">{program.timeline}</span>
                            </div>
                            <div className="detail-item">
                                <Users size={16} className="detail-icon" />
                                <span className="detail-label">Eligibility:</span>
                                <span className="detail-value">{program.eligibility}</span>
                            </div>
                            <div className="detail-item">
                                <Award size={16} className="detail-icon" />
                                <span className="detail-label">Level:</span>
                                <span className="detail-value">{program.difficulty}</span>
                            </div>
                        </div>

                        <div className="program-tags">
                            {program.tags.map(tag => (
                                <span key={tag} className="program-tag">{tag}</span>
                            ))}
                        </div>

                        <a
                            href={program.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="program-link"
                        >
                            Learn More <ExternalLink size={16} />
                        </a>
                    </div>
                ))}
            </div>

            {filteredPrograms.length === 0 && (
                <div className="no-results">
                    <p>No programs match your filter criteria.</p>
                </div>
            )}

            {/* DSA & Competitive Programming Section */}
            <div className="resource-section fade-in">
                <h2 className="section-heading">DSA & Competitive Programming</h2>
                <div className="programs-grid">
                    {dsaResources.map((resource, index) => (
                        <div key={resource.id} className="program-card" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="program-header" style={{ borderTopColor: resource.color }}>
                                <div className="program-title-section">
                                    <h2 className="program-name">{resource.name}</h2>
                                    <span className="program-org">{resource.type}</span>
                                </div>
                            </div>
                            <p className="program-description">{resource.description}</p>
                            <div className="program-tags">
                                {resource.tags.map(tag => (
                                    <span key={tag} className="program-tag">{tag}</span>
                                ))}
                            </div>
                            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="program-link">
                                Visit <ExternalLink size={16} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Career & Tech Stack Resources Section */}
            <div className="resource-section fade-in">
                <h2 className="section-heading">Career & Tech Stack Resources</h2>
                <div className="programs-grid">
                    {careerResources.map((resource, index) => (
                        <div key={resource.id} className="program-card" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="program-header" style={{ borderTopColor: resource.color }}>
                                <div className="program-title-section">
                                    <h2 className="program-name">{resource.name}</h2>
                                    <span className="program-org">{resource.category}</span>
                                </div>
                            </div>
                            <p className="program-description">{resource.description}</p>
                            <div className="program-tags">
                                {resource.tags.map(tag => (
                                    <span key={tag} className="program-tag">{tag}</span>
                                ))}
                            </div>
                            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="program-link">
                                Start Learning <ExternalLink size={16} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
}

export default Explore;
