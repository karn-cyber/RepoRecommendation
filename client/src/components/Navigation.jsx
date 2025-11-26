import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Compass } from 'lucide-react';
import './Navigation.css';

function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="navigation">
            <div className="nav-container">
                <div className="nav-brand" onClick={() => navigate('/')}>
                    <span className="brand-text">RepoRecommendation</span>
                </div>

                <div className="nav-links">
                    <button
                        className={`nav-link ${isActive('/')}`}
                        onClick={() => navigate('/')}
                    >
                        Home
                    </button>
                    <button
                        className={`nav-link ${isActive('/dashboard')}`}
                        onClick={() => navigate('/dashboard')}
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </button>
                    <button
                        className={`nav-link ${isActive('/explore')}`}
                        onClick={() => navigate('/explore')}
                    >
                        <Compass size={18} />
                        Explore
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
