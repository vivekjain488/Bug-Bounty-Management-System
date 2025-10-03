import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getRedirectPath } from '../utils/auth';

const TriageLogin = () => {
  const navigate = useNavigate();
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
      // Check if the user is actually a triage team member
      if (result.user.role !== 'triage') {
        setError('Invalid triage credentials. Please contact your administrator for access.');
        return;
      }
      
      const redirectPath = getRedirectPath(result.user);
      navigate(redirectPath);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="visual-content">
            <h2 className="visual-title">🔍 Triage Team</h2>
            <p className="visual-text">
              Access the triage dashboard to review, validate, and manage bug reports from security researchers.
            </p>
            <div className="visual-stats">
              <div className="visual-stat">
                <span className="stat-num">24/7</span>
                <span className="stat-desc">Support</span>
              </div>
              <div className="visual-stat">
                <span className="stat-num">Fast</span>
                <span className="stat-desc">Reviews</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="auth-form-container">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="brand-icon">🐛</span>
              <span className="brand-text">BugHuntr</span>
            </Link>
            <h1 className="auth-title">Triage Team Login</h1>
            <p className="auth-subtitle">Access your triage dashboard to review reports</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="form-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Triage Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="triage@bughuntr.com"
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
              Login to Triage Dashboard →
            </button>
            
            <div className="auth-footer">
              <p>Individual researcher? <Link to="/login" className="auth-link">User Login</Link></p>
              <p>Company representative? <Link to="/company-login" className="auth-link">Company Login</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TriageLogin;
