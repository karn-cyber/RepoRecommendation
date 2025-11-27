import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Compass } from 'lucide-react';
import './Navigation.css';
import Logo from '../assets/Gemini_Generated_Image_u4kjcbu4kjcbu4kj-removebg-preview.png';

function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-brand">
                    <img src={logo} alt="RepoRecommendation Logo" className="nav-logo-img" />
                    <span className="brand-text">RepoRecommendation</span>
                </Link>

                <div className="nav-links">
                    <Compass size={18} />
                    Explore
                </button>
            </div>
        </div>
        </nav >
    );
}

export default Navigation;
