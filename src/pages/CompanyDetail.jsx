import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import { isAuthenticated, getCurrentUser } from '../utils/auth';
import { getCompanyById } from '../utils/mockData';
import { getProgramById } from '../utils/programs';
import { submitReport } from '../utils/reports';

const CompanyDetail = () => {
  const { id } = useParams();
  const currentUser = getCurrentUser();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    vulnerabilityType: 'XSS',
    severity: 'Medium',
    description: '',
    stepsToReproduce: '',
    impact: '',
    targetUrl: '',
    proofOfConcept: '',
  });

  useEffect(() => {
    const loadCompany = async () => {
      try {
        setLoading(true);
        // First try mock data
        let companyData = getCompanyById(id);
        
        // If not in mock data, try fetching from MongoDB
        if (!companyData) {
          console.log('🔍 Not in mock data, fetching from MongoDB...');
          companyData = await getProgramById(id);
          
          // Transform MongoDB program to company format
          if (companyData) {
            companyData = {
              id: companyData._id || companyData.id,
              name: companyData.name,
              logo: companyData.logo || '🏢',
              industry: companyData.industry,
              tags: companyData.tags || [],
              severity: companyData.severity || 'Medium',
              minBounty: companyData.minBounty || 0,
              maxBounty: companyData.maxBounty || 0,
              description: companyData.description,
              about: companyData.about,
              scope: companyData.scope || [],
              outOfScope: companyData.outOfScope || [],
              rules: companyData.rules || [],
              rewardStructure: companyData.rewardStructure || {}
            };
          }
        }
        
        setCompany(companyData);
        console.log('✅ Company/Program loaded:', companyData);
      } catch (error) {
        console.error('Error loading company:', error);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadCompany();
  }, [id]);

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="company-detail-page">
        <Navbar />
        <div className="dashboard-layout">
          <Sidebar />
          <main className="dashboard-main">
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2>Loading program details...</h2>
              <p>Please wait...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="company-detail-page">
        <Navbar />
        <div className="dashboard-layout">
          <Sidebar />
          <main className="dashboard-main">
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2>Program not found</h2>
              <p>The requested program could not be found.</p>
              <Link to="/companies" className="btn btn-primary">
                ← Back to All Companies
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.stepsToReproduce || !formData.impact) {
      setMessage('Please fill in all required fields (Title, Description, Steps to Reproduce, and Impact)');
      return;
    }

    // Prepare report data - map frontend fields to backend fields
    const reportData = {
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
      category: formData.vulnerabilityType, // Map vulnerabilityType to category
      stepsToReproduce: formData.stepsToReproduce,
      impact: formData.impact,
      companyId: (company._id || company.id).toString(),
      programId: (company._id || company.id).toString(),
      // Optional fields
      tags: formData.targetUrl ? [`Target: ${formData.targetUrl}`] : [],
      attachments: formData.proofOfConcept ? [formData.proofOfConcept] : [],
    };

    setMessage('Submitting report...');
    const result = await submitReport(reportData);
    
    if (result.success) {
      setMessage('✅ Report submitted successfully! You can track it in My Reports.');
      setFormData({
        title: '',
        vulnerabilityType: 'XSS',
        severity: 'Medium',
        description: '',
        stepsToReproduce: '',
        impact: '',
        targetUrl: '',
        proofOfConcept: '',
      });
      setTimeout(() => {
        setShowReportForm(false);
        setMessage('');
      }, 3000);
    } else {
      setMessage('❌ ' + result.message);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'severity-info';
    }
  };

  return (
    <div className="company-detail-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className="dashboard-main">
          <div className="company-detail-container">
            {/* Company Header */}
            <div className="company-detail-header">
              <div className="company-logo-large">{company.logo}</div>
              <div className="company-header-info">
                <h1 className="company-detail-name">{company.name}</h1>
                <p className="company-industry">{company.industry}</p>
                <div className="company-tags">
                  {company.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowReportForm(!showReportForm)}
                className="btn btn-primary btn-large"
              >
                {showReportForm ? 'Cancel' : '🐛 Report a Bug'}
              </button>
            </div>

            {message && (
              <div className={`form-message ${message.includes('✅') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            {/* Report Form */}
            {showReportForm && (
              <div className="report-form-section">
                <h2 className="section-heading">Submit Vulnerability Report</h2>
                <form onSubmit={handleSubmit} className="report-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Report Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g., XSS vulnerability in user profile"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Vulnerability Type *</label>
                      <select
                        name="vulnerabilityType"
                        value={formData.vulnerabilityType}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="XSS">Cross-Site Scripting (XSS)</option>
                        <option value="SQLi">SQL Injection</option>
                        <option value="CSRF">Cross-Site Request Forgery</option>
                        <option value="Authentication">Authentication Bypass</option>
                        <option value="Authorization">Authorization Issues</option>
                        <option value="IDOR">Insecure Direct Object Reference</option>
                        <option value="RCE">Remote Code Execution</option>
                        <option value="SSRF">Server-Side Request Forgery</option>
                        <option value="File Upload">File Upload Vulnerability</option>
                        <option value="XXE">XML External Entity</option>
                        <option value="Information Disclosure">Information Disclosure</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Severity *</label>
                      <select
                        name="severity"
                        value={formData.severity}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target URL</label>
                    <input
                      type="url"
                      name="targetUrl"
                      value={formData.targetUrl}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="https://example.com/vulnerable-page"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-textarea"
                      rows="4"
                      placeholder="Provide a clear description of the vulnerability..."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Steps to Reproduce *</label>
                    <textarea
                      name="stepsToReproduce"
                      value={formData.stepsToReproduce}
                      onChange={handleChange}
                      className="form-textarea"
                      rows="6"
                      placeholder="1. Navigate to...&#10;2. Click on...&#10;3. Observe that..."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Impact *</label>
                    <textarea
                      name="impact"
                      value={formData.impact}
                      onChange={handleChange}
                      className="form-textarea"
                      rows="3"
                      placeholder="Describe the potential impact of this vulnerability..."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Proof of Concept</label>
                    <textarea
                      name="proofOfConcept"
                      value={formData.proofOfConcept}
                      onChange={handleChange}
                      className="form-textarea"
                      rows="4"
                      placeholder="Provide code, screenshots URLs, or other evidence..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-large btn-block">
                    Submit Report →
                  </button>
                </form>
              </div>
            )}

            {/* Company Information */}
            <div className="company-info-grid">
              <div className="info-card">
                <h2 className="section-heading">About {company.name}</h2>
                <p className="info-text">{company.about}</p>
              </div>

              <div className="info-card">
                <h2 className="section-heading">Reward Structure</h2>
                <div className="reward-table">
                  {Object.entries(company.rewardStructure).map(([severity, reward]) => (
                    <div key={severity} className="reward-row">
                      <span className={`severity-badge ${getSeverityColor(severity)}`}>
                        {severity}
                      </span>
                      <span className="reward-value">{reward}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="info-card">
                <h2 className="section-heading">Scope</h2>
                <ul className="scope-list">
                  {company.scope.map((item, index) => (
                    <li key={index} className="scope-item">
                      <span className="scope-icon">✅</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="info-card">
                <h2 className="section-heading">Out of Scope</h2>
                <ul className="scope-list out-of-scope">
                  {company.outOfScope.map((item, index) => (
                    <li key={index} className="scope-item">
                      <span className="scope-icon">❌</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="info-card full-width">
                <h2 className="section-heading">Rules & Guidelines</h2>
                <ul className="rules-list">
                  {company.rules.map((rule, index) => (
                    <li key={index} className="rule-item">
                      <span className="rule-number">{index + 1}.</span>
                      <span className="rule-text">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="company-actions-footer">
              <Link to="/companies" className="btn btn-secondary">
                ← Back to All Companies
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDetail;

