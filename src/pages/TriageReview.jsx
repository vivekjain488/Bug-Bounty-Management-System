import { useState, useEffect } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { isTriageTeam, getCurrentUser } from '../utils/auth';
import { getReportById, updateReportStatus } from '../utils/reports';
import { getCompanyById } from '../utils/mockData';

const TriageReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [report, setReport] = useState(null);
  const [company, setCompany] = useState(null);
  const [reviewData, setReviewData] = useState({
    status: '',
    reward: '',
    feedback: '',
    internalNotes: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const reportData = getReportById(id);
    if (reportData) {
      setReport(reportData);
      setCompany(getCompanyById(reportData.companyId));
      setReviewData({
        status: reportData.status,
        reward: reportData.reward || '',
        feedback: reportData.feedback || '',
        internalNotes: ''
      });
    }
  }, [id]);

  if (!isTriageTeam()) {
    return <Navigate to="/triage-login" />;
  }

  if (!report) {
    return (
      <div className="triage-review-page">
        <Navbar />
        <div className="dashboard-layout">
          <main className="dashboard-main">
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2>Report not found</h2>
              <p>The requested report could not be found.</p>
              <button onClick={() => navigate('/triage-dashboard')} className="btn btn-primary">
                ← Back to Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewData.status || !reviewData.feedback) {
      setMessage('Please provide status and feedback');
      return;
    }

    if (reviewData.status === 'Accepted' && !reviewData.reward) {
      setMessage('Please specify bounty amount for accepted reports');
      return;
    }

    setMessage('Processing review...');
    const result = updateReportStatus(
      report.id,
      reviewData.status,
      reviewData.reward ? Number(reviewData.reward) : null,
      reviewData.feedback
    );
    
    if (result.success) {
      setMessage('✅ Report review completed successfully!');
      setTimeout(() => {
        navigate('/triage-dashboard');
      }, 2000);
    } else {
      setMessage('❌ ' + result.message);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'severity-info';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'status-accepted';
      case 'Rejected': return 'status-rejected';
      case 'In Review': return 'status-review';
      case 'Pending Review': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const getSuggestedBounty = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return { min: 5000, max: 25000 };
      case 'high': return { min: 2000, max: 10000 };
      case 'medium': return { min: 500, max: 3000 };
      case 'low': return { min: 100, max: 800 };
      default: return { min: 100, max: 1000 };
    }
  };

  const suggestedBounty = getSuggestedBounty(report.severity);

  return (
    <div className="triage-review-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <aside className="triage-sidebar">
          <div className="sidebar-menu">
            <Link to="/triage-dashboard" className="sidebar-item">
              <span className="sidebar-icon">🔍</span>
              <span className="sidebar-label">Review Queue</span>
            </Link>
            <div className="sidebar-item active">
              <span className="sidebar-icon">📋</span>
              <span className="sidebar-label">Report Review</span>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-label">Analytics</span>
            </div>
          </div>
        </aside>
        
        <main className="dashboard-main">
          <div className="review-container">
            <div className="review-header">
              <button onClick={() => navigate('/triage-dashboard')} className="btn btn-secondary">
                ← Back to Queue
              </button>
              <div className="review-meta">
                <span className={`status-badge ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
                <span className={`severity-badge ${getSeverityColor(report.severity)}`}>
                  {report.severity}
                </span>
              </div>
            </div>

            {message && (
              <div className={`form-message ${message.includes('✅') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            {/* Report Details */}
            <div className="report-detail-section">
              <div className="detail-header">
                <div className="company-info">
                  <span className="company-logo-lg">{company?.logo || '🏢'}</span>
                  <div>
                    <h1 className="report-title">{report.title}</h1>
                    <p className="company-name">Reported to: {company?.name || 'Unknown Company'}</p>
                    <p className="researcher-info">By: @{report.username} on {new Date(report.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-card">
                  <h3>Vulnerability Details</h3>
                  <div className="detail-item">
                    <strong>Type:</strong> {report.vulnerabilityType}
                  </div>
                  <div className="detail-item">
                    <strong>Severity:</strong> {report.severity}
                  </div>
                  <div className="detail-item">
                    <strong>Target URL:</strong> {report.targetUrl || 'Not specified'}
                  </div>
                </div>

                <div className="detail-card">
                  <h3>Description</h3>
                  <p className="detail-text">{report.description}</p>
                </div>

                <div className="detail-card">
                  <h3>Steps to Reproduce</h3>
                  <pre className="detail-text">{report.stepsToReproduce}</pre>
                </div>

                <div className="detail-card">
                  <h3>Impact Assessment</h3>
                  <p className="detail-text">{report.impact || 'Not provided'}</p>
                </div>

                <div className="detail-card">
                  <h3>Proof of Concept</h3>
                  <pre className="detail-text">{report.proofOfConcept || 'Not provided'}</pre>
                </div>
              </div>
            </div>

            {/* Review Form */}
            <div className="review-form-section">
              <h2 className="section-heading">Triage Review</h2>
              
              <form onSubmit={handleSubmit} className="review-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Review Decision *</label>
                    <select
                      name="status"
                      value={reviewData.status}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="">Select Decision</option>
                      <option value="In Review">Move to In Review</option>
                      <option value="Accepted">Accept Report</option>
                      <option value="Rejected">Reject Report</option>
                    </select>
                  </div>

                  {reviewData.status === 'Accepted' && (
                    <div className="form-group">
                      <label className="form-label">Bounty Amount * (${suggestedBounty.min} - ${suggestedBounty.max} suggested)</label>
                      <input
                        type="number"
                        name="reward"
                        value={reviewData.reward}
                        onChange={handleChange}
                        className="form-input"
                        placeholder={`Suggested: $${suggestedBounty.min} - $${suggestedBounty.max}`}
                        min="0"
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Feedback to Researcher *</label>
                  <textarea
                    name="feedback"
                    value={reviewData.feedback}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="5"
                    placeholder="Provide detailed feedback about the vulnerability report..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Internal Notes (optional)</label>
                  <textarea
                    name="internalNotes"
                    value={reviewData.internalNotes}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="Internal notes for your team (not visible to researcher)..."
                  />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => navigate('/triage-dashboard')} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-large">
                    Submit Review →
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TriageReview;
