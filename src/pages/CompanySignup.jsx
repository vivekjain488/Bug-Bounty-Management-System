import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../utils/auth';

const CompanySignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    
    // Validation
    if (!formData.companyName || !formData.fullName || !formData.username || 
        !formData.email || !formData.password || !formData.confirmPassword || 
        !formData.industry) {
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

    setError('Creating company account...');
    const result = await signup({
      ...formData,
      role: 'company'
    });
    
    if (result.success) {
      alert('Company account created successfully! Please login.');
      navigate('/company-login');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="visual-content">
            <h2 className="visual-title">🏢 Join as Company!</h2>
            <p className="visual-text">
              Host bug bounty programs, work with security researchers, and strengthen your security posture.
            </p>
            <div className="visual-stats">
              <div className="visual-stat">
                <span className="stat-num">5000+</span>
                <span className="stat-desc">Researchers</span>
              </div>
              <div className="visual-stat">
                <span className="stat-num">99%</span>
                <span className="stat-desc">Valid Reports</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="auth-form-container">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="brand-icon">🐛</span>
              <span className="brand-text">BugFlow</span>
            </Link>
            <h1 className="auth-title">Company Registration</h1>
            <p className="auth-subtitle">Create your company account to start hosting bug bounty programs</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="form-error">{error}</div>}
            
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

            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Contact Person *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
                placeholder="John Smith (Security Manager)"
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
                placeholder="techcorp_security"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Company Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="security@techcorp.com"
              />
            </div>

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
                placeholder="https://www.techcorp.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password *</label>
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
              <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
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
              Create Company Account →
            </button>
            
            <div className="auth-footer">
              <p>Already have a company account? <Link to="/company-login" className="auth-link">Login</Link></p>
              <p>Individual researcher? <Link to="/signup" className="auth-link">Sign up as User</Link></p>
              <p>Triage team member? <Link to="/triage-login" className="auth-link">Triage Login</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySignup;
