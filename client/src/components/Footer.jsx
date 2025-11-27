import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart, Code } from 'lucide-react';
import './Footer.css';
import logo from '../assets/Gemini_Generated_Image_u4kjcbu4kjcbu4kj-removebg-preview.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <img src={logo} alt="RepoRecommendation Logo" className="footer-logo-img" />
                        <span className="brand-text">RepoRecommendation</span>
                    </Link>
                    <p className="footer-description">
                        Empowering developers to find their perfect open source contribution match.
                        Level up your coding skills with curated challenges and resources.
                    </p>
                    <div className="social-links">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                            <Github size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                            <Twitter size={20} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                            <Linkedin size={20} />
                        </a>
                        <a href="mailto:contact@reporecommendation.com" className="social-link">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>

                <div className="footer-links-container">
                    <div className="footer-column">
                        <h3>Product</h3>
                        <Link to="/">Home</Link>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/explore">Explore</Link>
                        <Link to="/results">Search Repos</Link>
                    </div>

                    <div className="footer-column">
                        <h3>Resources</h3>
                        <Link to="/explore">DSA Roadmap</Link>
                        <Link to="/explore">Open Source Programs</Link>
                        <Link to="/explore">Competitions</Link>
                        <Link to="/explore">Tech Stack Guide</Link>
                    </div>

                    <div className="footer-column">
                        <h3>Community</h3>
                        <a href="https://github.com/karn-cyber/RepoRecommendation" target="_blank" rel="noopener noreferrer">GitHub Repo</a>
                        <a href="#" target="_blank" rel="noopener noreferrer">Discord</a>
                        <a href="#" target="_blank" rel="noopener noreferrer">Blog</a>
                        <a href="#" target="_blank" rel="noopener noreferrer">Contributors</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="copyright">
                    © {currentYear} RepoRecommendation. All rights reserved.
                </div>
                <div className="made-with">
                    Made with <Heart size={16} className="heart-icon" /> and <Code size={16} className="code-icon" /> by Developers
                </div>
            </div>
        </footer>
    );
};

export default Footer;
