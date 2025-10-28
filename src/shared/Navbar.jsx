import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={currentUser ? "/dashboard" : "/"} className="navbar-brand">
          <span className="brand-icon">🐛</span>
          <span className="brand-text">BugFlow</span>
        </Link>
        
        {currentUser ? (
          <div className="navbar-user">
            <Link to="/profile" className="user-info">
              <div className="user-avatar">{currentUser.username[0].toUpperCase()}</div>
              <span className="user-name">{currentUser.username}</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-actions">
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

