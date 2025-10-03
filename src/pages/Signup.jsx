import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../utils/auth';

const Signup = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('user'); // 'user', 'company'
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Company-specific fields
    companyName: '',
    industry: '',
    website: '',
  });
  const [error, setError] = useState('');

  const industries = [
    'Technology',
    'Fintech', 
    'Healthcare',
    'E-commerce',
    'Education',
    'Gaming',
    'Social Media',
    'Cloud Storage',
    'Communication',
    'Analytics',
    'Travel',
    'Developer Tools'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['fullName', 'username', 'email', 'password', 'confirmPassword'];
    if (userType === 'company') {
      requiredFields.push('companyName', 'industry');
    }
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('Creating account...');
    const result = await signup({
      ...formData,
      role: userType
    });
    
    if (result.success) {
      alert('Account created successfully! Please login.');
      navigate('/login');
    } else {
      setError(result.message);
    }
  };

  const getUserTypeConfig = (type) => {
    switch (type) {
      case 'user':
        return {
          title: '🔍 Create Researcher Account',
          subtitle: 'Start your bug hunting journey',
          visualTitle: '🚀 Start Hunting!',
          visualText: 'Join the elite community of security researchers and start earning bounties today.'
        };
      case 'company':
        return {
          title: '🏢 Create Company Account',
          subtitle: 'Host bug bounty programs',
          visualTitle: '🏢 Join as Company!',
          visualText: 'Host bug bounty programs, work with security researchers, and strengthen your security.'
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
            <div className="visual-stats">
              <div className="visual-stat">
                <span className="stat-num">$50K</span>
                <span className="stat-desc">Max Bounty</span>
              </div>
              <div className="visual-stat">
                <span className="stat-num">{userType === 'company' ? '5000+' : '150+'}</span>
                <span className="stat-desc">{userType === 'company' ? 'Researchers' : 'Programs'}</span>
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
            </div>
            
            <h1 className="auth-title">{config.title}</h1>
            <p className="auth-subtitle">{config.subtitle}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="form-error">{error}</div>}
            
            {/* Company-specific field */}
            {userType === 'company' && (
              <div className="form-group">
                <label htmlFor="companyName" className="form-label">Company Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="TechCorp Inc."
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                {userType === 'company' ? 'Contact Person *' : 'Full Name *'}
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
                placeholder={userType === 'company' ? 'John Smith (Security Manager)' : 'John Doe'}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder={userType === 'company' ? 'techcorp_security' : 'bughunter123'}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {userType === 'company' ? 'Company Email *' : 'Email Address *'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder={userType === 'company' ? 'security@company.com' : 'hunter@example.com'}
              />
            </div>

            {/* Company-specific fields */}
            {userType === 'company' && (
              <>
                <div className="form-group">
                  <label htmlFor="industry" className="form-label">Industry *</label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select Industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="website" className="form-label">Company Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://www.company.com"
                  />
                </div>
              </>
            )}
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Min. 6 characters"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Confirm your password"
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">
              Create Account →
            </button>
            
            <div className="auth-footer">
              <p>Already have an account? <Link to="/login" className="auth-link">Login</Link></p>
              {userType === 'user' && (
                <p>Are you a company? <button type="button" onClick={() => setUserType('company')} className="auth-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>Register as Company</button></p>
              )}
              <div className="triage-note">
                <p style={{fontSize: '12px', color: 'var(--color-gray)', marginTop: '16px'}}>
                  ⚖️ Triage team access is by invitation only. Contact admin for access.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

