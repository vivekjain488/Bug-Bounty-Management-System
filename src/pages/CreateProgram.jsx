import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { isCompany, getCurrentUser } from '../utils/auth';
import { createProgram } from '../utils/programs';

const CreateProgram = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    about: '',
    logo: '',
    tags: '',
    scope: '',
    outOfScope: '',
    rules: '',
    rewardStructure: {
      Critical: { min: '', max: '' },
      High: { min: '', max: '' },
      Medium: { min: '', max: '' },
      Low: { min: '', max: '' }
    }
  });
  const [message, setMessage] = useState('');

  if (!isCompany()) {
    return <Navigate to="/company-login" />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage('');
  };

  const handleRewardChange = (severity, type, value) => {
    setFormData({
      ...formData,
      rewardStructure: {
        ...formData.rewardStructure,
        [severity]: {
          ...formData.rewardStructure[severity],
          [type]: value
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.industry || !formData.description || !formData.about) {
      setMessage('Please fill in all required fields');
      return;
    }

    // Process arrays from text inputs
    const processedData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      scope: formData.scope.split('\n').map(item => item.trim()).filter(item => item),
      outOfScope: formData.outOfScope.split('\n').map(item => item.trim()).filter(item => item),
      rules: formData.rules.split('\n').map(rule => rule.trim()).filter(rule => rule),
      rewardStructure: {
        Critical: `$${formData.rewardStructure.Critical.min} - $${formData.rewardStructure.Critical.max}`,
        High: `$${formData.rewardStructure.High.min} - $${formData.rewardStructure.High.max}`,
        Medium: `$${formData.rewardStructure.Medium.min} - $${formData.rewardStructure.Medium.max}`,
        Low: `$${formData.rewardStructure.Low.min} - $${formData.rewardStructure.Low.max}`
      },
      companyId: currentUser.id,
      createdBy: currentUser.username
    };

    setMessage('Creating program...');
    const result = await createProgram(processedData);
    
    if (result.success) {
      setMessage('✅ Bug bounty program created successfully!');
      setTimeout(() => {
        navigate('/company-dashboard');
      }, 2000);
    } else {
      setMessage('❌ ' + result.message);
    }
  };

  return (
    <div className="create-program-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <aside className="company-sidebar">
          <div className="sidebar-menu">
            <div className="sidebar-item">
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-label">Dashboard</span>
            </div>
            <div className="sidebar-item active">
              <span className="sidebar-icon">🚀</span>
              <span className="sidebar-label">Create Program</span>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-icon">🏢</span>
              <span className="sidebar-label">My Programs</span>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-icon">📋</span>
              <span className="sidebar-label">Reports</span>
            </div>
          </div>
        </aside>
        
        <main className="dashboard-main">
          <div className="create-program-container">
            <div className="page-header">
              <h1 className="dashboard-title">Create Bug Bounty Program</h1>
              <p className="dashboard-subtitle">Launch a new security program to work with researchers</p>
            </div>

            {message && (
              <div className={`form-message ${message.includes('✅') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="program-form">
              {/* Basic Information */}
              <div className="form-section">
                <h2 className="section-heading">Basic Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Program Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., TechCorp Security Program"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Industry *</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="">Select Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Fintech">Fintech</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Education">Education</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Cloud Storage">Cloud Storage</option>
                      <option value="Communication">Communication</option>
                      <option value="Analytics">Analytics</option>
                      <option value="Travel">Travel</option>
                      <option value="Developer Tools">Developer Tools</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Logo Emoji</label>
                  <input
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="🚀 (single emoji)"
                    maxLength="2"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Web, Mobile, API, Cloud"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="Brief description for program cards (max 200 characters)"
                    maxLength="200"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">About Your Company *</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="5"
                    placeholder="Detailed information about your company and what you do..."
                  />
                </div>
              </div>

              {/* Scope Definition */}
              <div className="form-section">
                <h2 className="section-heading">Program Scope</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">In Scope (one per line)</label>
                    <textarea
                      name="scope"
                      value={formData.scope}
                      onChange={handleChange}
                      className="form-textarea"
                      rows="6"
                      placeholder="*.yourcompany.com&#10;api.yourcompany.com&#10;mobile apps (iOS & Android)&#10;Desktop applications"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Out of Scope (one per line)</label>
                    <textarea
                      name="outOfScope"
                      value={formData.outOfScope}
                      onChange={handleChange}
                      className="form-textarea"
                      rows="6"
                      placeholder="Third-party integrations&#10;Social engineering attacks&#10;DDoS attacks"
                    />
                  </div>
                </div>
              </div>

              {/* Rules & Guidelines */}
              <div className="form-section">
                <h2 className="section-heading">Rules & Guidelines</h2>
                
                <div className="form-group">
                  <label className="form-label">Program Rules (one per line)</label>
                  <textarea
                    name="rules"
                    value={formData.rules}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="8"
                    placeholder="Do not access or modify user data without permission&#10;Report findings within 24 hours of discovery&#10;Do not publicly disclose vulnerabilities before they are fixed&#10;Only test on designated testing environments when possible"
                  />
                </div>
              </div>

              {/* Reward Structure */}
              <div className="form-section">
                <h2 className="section-heading">Reward Structure</h2>
                
                <div className="rewards-grid">
                  {['Critical', 'High', 'Medium', 'Low'].map(severity => (
                    <div key={severity} className="reward-group">
                      <h3 className={`severity-title ${severity.toLowerCase()}`}>{severity}</h3>
                      <div className="reward-inputs">
                        <input
                          type="number"
                          placeholder="Min"
                          value={formData.rewardStructure[severity].min}
                          onChange={(e) => handleRewardChange(severity, 'min', e.target.value)}
                          className="reward-input"
                          min="0"
                        />
                        <span className="reward-separator">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={formData.rewardStructure[severity].max}
                          onChange={(e) => handleRewardChange(severity, 'max', e.target.value)}
                          className="reward-input"
                          min="0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => navigate('/company-dashboard')} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-large">
                  🚀 Launch Program
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateProgram;
