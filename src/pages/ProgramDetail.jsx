import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { getProgramById } from '../utils/programs';
import { submitReport } from '../utils/reports';
import { isAuthenticated } from '../utils/auth';

const ProgramDetail = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: 'XSS',
    severity: 'Medium',
    description: '',
    stepsToReproduce: '',
    impact: '',
    targetUrl: '',
    proofOfConcept: ''
  });

  useEffect(() => {
    loadProgram();
  }, [id]);

  const loadProgram = async () => {
    setLoading(true);
    const programData = await getProgramById(id);
    setProgram(programData);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      setMessage('Please login to submit a report');
      setTimeout(() => window.location.href = '/login', 2000);
      return;
    }

    const reportData = {
      ...formData,
      programId: program._id || program.id,
      companyId: program.companyId
    };

    setMessage('Submitting report...');
    const result = await submitReport(reportData);

    if (result.success) {
      setMessage('✅ Report submitted successfully!');
      setFormData({
        title: '',
        category: 'XSS',
        severity: 'Medium',
        description: '',
        stepsToReproduce: '',
        impact: '',
        targetUrl: '',
        proofOfConcept: ''
      });
      setTimeout(() => {
        setShowReportForm(false);
        setMessage('');
      }, 3000);
    } else {
      setMessage('❌ ' + result.message);
    }
  };

  if (loading) {
    return (
      <div className="program-detail-page">
        <Navbar />
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading program...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!program) {
    return <Navigate to="/programs" />;
  }

  return (
    <div className="program-detail-page">
      <Navbar />

      <div className="program-detail-container">
        {/* Program Header */}
        <div className="program-detail-header">
          <div className="program-logo-large">{program.logo || '🏢'}</div>
          <div className="program-header-info">
            <h1 className="program-detail-name">{program.name}</h1>
            <p className="program-industry">{program.industry}</p>
            <div className="program-meta">
              <span className="status-badge status-accepted">Active Program</span>
              <span className="meta-item">🐛 {program.reportsCount || 0} Reports</span>
              <span className="meta-item">💰 ${(program.totalPaid || 0).toLocaleString()} Paid</span>
            </div>
          </div>
          <button
            onClick={() => setShowReportForm(!showReportForm)}
            className="btn btn-primary btn-large"
          >
            {showReportForm ? 'Cancel' : '🐛 Submit Report'}
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
              <div className="form-group">
                <label className="form-label">Report Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Brief description of the vulnerability"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="XSS">XSS</option>
                    <option value="SQLi">SQL Injection</option>
                    <option value="CSRF">CSRF</option>
                    <option value="Authentication">Authentication</option>
                    <option value="Authorization">Authorization</option>
                    <option value="IDOR">IDOR</option>
                    <option value="RCE">RCE</option>
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
                  placeholder="https://example.com/vulnerable-endpoint"
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
                  placeholder="Detailed description of the vulnerability"
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
                  placeholder="1. Step one&#10;2. Step two&#10;3. Observe the vulnerability"
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
                  placeholder="What is the potential impact of this vulnerability?"
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
                  placeholder="Code, screenshots, or other proof"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-large btn-block">
                Submit Report →
              </button>
            </form>
          </div>
        )}

        {/* Program Details */}
        <div className="program-info-grid">
          <div className="info-card">
            <h2 className="section-heading">About</h2>
            <p>{program.description || 'Security research program'}</p>
          </div>

          <div className="info-card">
            <h2 className="section-heading">Reward Structure</h2>
            <div className="reward-table">
              <div className="reward-row">
                <span className="severity-badge severity-critical">Critical</span>
                <span className="reward-value">${program.rewards?.critical || '5,000 - 25,000'}</span>
              </div>
              <div className="reward-row">
                <span className="severity-badge severity-high">High</span>
                <span className="reward-value">${program.rewards?.high || '2,000 - 10,000'}</span>
              </div>
              <div className="reward-row">
                <span className="severity-badge severity-medium">Medium</span>
                <span className="reward-value">${program.rewards?.medium || '500 - 3,000'}</span>
              </div>
              <div className="reward-row">
                <span className="severity-badge severity-low">Low</span>
                <span className="reward-value">${program.rewards?.low || '100 - 800'}</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h2 className="section-heading">In Scope</h2>
            <ul className="scope-list">
              {(program.scope || ['*.example.com', 'api.example.com', 'mobile apps']).map((item, index) => (
                <li key={index} className="scope-item">
                  <span className="scope-icon">✅</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="info-card">
            <h2 className="section-heading">Out of Scope</h2>
            <ul className="scope-list out-of-scope">
              {(program.outOfScope || ['Social engineering', 'Physical attacks', 'DoS/DDoS']).map((item, index) => (
                <li key={index} className="scope-item">
                  <span className="scope-icon">❌</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="info-card full-width">
            <h2 className="section-heading">Program Rules</h2>
            <ul className="rules-list">
              {(program.rules || [
                'Make a good faith effort to avoid privacy violations',
                'Do not access or modify data that does not belong to you',
                'Only test on assets explicitly listed in scope',
                'Provide detailed reproduction steps',
                'Allow reasonable time for fixes before public disclosure'
              ]).map((rule, index) => (
                <li key={index} className="rule-item">
                  <span className="rule-number">{index + 1}.</span>
                  <span className="rule-text">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="program-actions-footer">
          <Link to="/programs" className="btn btn-secondary">
            ← Back to All Programs
          </Link>
          {!showReportForm && (
            <button onClick={() => setShowReportForm(true)} className="btn btn-primary">
              Submit Report →
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProgramDetail;
