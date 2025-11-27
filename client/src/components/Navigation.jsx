import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, LayoutDashboard } from 'lucide-react';
import './Navigation.css';
import logo from '../assets/Gemini_Generated_Image_u4kjcbu4kjcbu4kj-removebg-preview.png';

function Navigation() {
    const location = useLocation();

    return (
        <nav className="navigation">
            <div className="nav-container">
                <Link to="/" className="nav-brand">
                    <img src={logo} alt="RepoRecommendation Logo" className="nav-logo-img" />
                    <span className="brand-text">RepoRecommendation</span>
                </Link>

                <div className="nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        <Home size={20} />
                        <span>Home</span>
                    </Link>
                    <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/explore" className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}>
                        <Compass size={20} />
                        <span>Explore</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
