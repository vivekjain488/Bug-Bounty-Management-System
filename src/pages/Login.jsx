import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getRedirectPath } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('user'); // 'user', 'company', 'triage'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setError('Logging in...');
    const result = await login(formData);
    
    if (result.success) {
      // Check if the user's role matches the selected type
      if (result.user.role !== userType) {
        setError(`Invalid credentials for ${userType === 'user' ? 'researcher' : userType} account. Please check your account type.`);
        return;
      }
      
      const redirectPath = getRedirectPath(result.user);
      navigate(redirectPath);
    } else {
      setError(result.message);
    }
  };

  const getUserTypeConfig = (type) => {
    switch (type) {
      case 'user':
        return {
          title: '🔍 Researcher Login',
          subtitle: 'Access your bug hunting dashboard',
          visualTitle: '🐛 Welcome Back!',
          visualText: 'Continue your bug hunting journey. Your dashboard awaits.',
          placeholder: 'hunter@example.com'
        };
      case 'company':
        return {
          title: '🏢 Company Login',
          subtitle: 'Access your company dashboard',
          visualTitle: '🏢 Company Portal',
          visualText: 'Manage your bug bounty programs and review security reports.',
          placeholder: 'security@company.com'
        };
      case 'triage':
        return {
          title: '⚖️ Triage Login',
          subtitle: 'Access your triage dashboard',
          visualTitle: '🔍 Triage Team',
          visualText: 'Review and validate bug reports from security researchers.',
          placeholder: 'triage@BugFlow.com'
        };
      default:
        return getUserTypeConfig('user');
    }
  };

  const config = getUserTypeConfig(userType);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="visual-content">
            <h2 className="visual-title">{config.visualTitle}</h2>
            <p className="visual-text">
              {config.visualText}
            </p>
            <div className="visual-decoration">
              <div className="deco-box box-1"></div>
              <div className="deco-box box-2"></div>
              <div className="deco-box box-3"></div>
            </div>
          </div>
        </div>
        
        <div className="auth-form-container">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="brand-icon">🐛</span>
              <span className="brand-text">BugFlow</span>
            </Link>
            
            {/* User Type Toggle */}
            <div className="user-type-toggle">
              <button
                type="button"
                className={`toggle-btn ${userType === 'user' ? 'active' : ''}`}
                onClick={() => setUserType('user')}
              >
                🔍 Researcher
              </button>
              <button
                type="button"
                className={`toggle-btn ${userType === 'company' ? 'active' : ''}`}
                onClick={() => setUserType('company')}
              >
                🏢 Company
              </button>
              <button
                type="button"
                className={`toggle-btn ${userType === 'triage' ? 'active' : ''}`}
                onClick={() => setUserType('triage')}
              >
                ⚖️ Triage
              </button>
            </div>
            
            <h1 className="auth-title">{config.title}</h1>
            <p className="auth-subtitle">{config.subtitle}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="form-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder={config.placeholder}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">
              Login →
            </button>

            {/* Demo Credentials Helper */}
            <div className="demo-credentials">
              <p className="demo-title">🧪 Demo Credentials:</p>
              <button 
                type="button"
                className="demo-btn"
                onClick={() => {
                  setFormData({
                    email: userType === 'user' ? 'demo@researcher.com' : 
                           userType === 'company' ? 'demo@company.com' : 'demo@triage.com',
                    password: 'demo123'
                  });
                }}
              >
                Fill Demo Login
              </button>
            </div>
            
            <div className="auth-footer">
              <p>Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

