import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getRedirectPath } from '../utils/auth';

const CompanyLogin = () => {
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
      // Check if the user is actually a company
      if (result.user.role !== 'company') {
        setError('Invalid company credentials. Please use the correct login page for your account type.');
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
            <h2 className="visual-title">🏢 Company Portal</h2>
            <p className="visual-text">
              Access your company dashboard to manage bug bounty programs, review reports, and pay bounties.
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
            <h1 className="auth-title">Company Login</h1>
            <p className="auth-subtitle">Enter your company credentials to access your dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="form-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Company Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="security@company.com"
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
              Login to Company Dashboard →
            </button>
            
            <div className="auth-footer">
              <p>Don't have a company account? <Link to="/company-signup" className="auth-link">Register Company</Link></p>
              <p>Individual researcher? <Link to="/login" className="auth-link">User Login</Link></p>
              <p>Triage team member? <Link to="/triage-login" className="auth-link">Triage Login</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;
