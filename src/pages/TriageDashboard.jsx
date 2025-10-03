import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { isTriageTeam, getCurrentUser } from '../utils/auth';
import { getAllReports, updateReportStatus } from '../utils/reports';
import { getCompanyById } from '../utils/mockData';

const TriageDashboard = () => {
  const currentUser = getCurrentUser();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    inReviewReports: 0,
    reviewedToday: 0
  });

  useEffect(() => {
    if (currentUser) {
      loadReports();
    }
  }, [currentUser]);

  const loadReports = () => {
    const allReports = getAllReports();
    setReports(allReports.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
    
    const totalReports = allReports.length;
    const pendingReports = allReports.filter(r => r.status === 'Pending Review').length;
    const inReviewReports = allReports.filter(r => r.status === 'In Review').length;
    const today = new Date().toDateString();
    const reviewedToday = allReports.filter(r => 
      r.updatedAt && new Date(r.updatedAt).toDateString() === today
    ).length;

    setStats({
      totalReports,
      pendingReports,
      inReviewReports,
      reviewedToday
    });
  };

  if (!isTriageTeam()) {
    return <Navigate to="/triage-login" />;
  }

  const getFilteredReports = () => {
    switch (filter) {
      case 'pending':
        return reports.filter(r => r.status === 'Pending Review');
      case 'reviewing':
        return reports.filter(r => r.status === 'In Review');
      case 'completed':
        return reports.filter(r => r.status === 'Accepted' || r.status === 'Rejected');
      default:
        return reports;
    }
  };

  const handleStatusChange = async (reportId, newStatus, reward = null, feedback = '') => {
    const result = updateReportStatus(reportId, newStatus, reward, feedback);
    if (result.success) {
      loadReports(); // Reload to get updated data
      alert(`Report ${newStatus.toLowerCase()} successfully!`);
    } else {
      alert('Error updating report: ' + result.message);
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

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'severity-info';
    }
  };

  const getPriorityScore = (report) => {
    const severityScores = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    const ageInHours = (Date.now() - new Date(report.submittedAt)) / (1000 * 60 * 60);
    return (severityScores[report.severity?.toLowerCase()] || 1) + (ageInHours / 24);
  };

  const filteredReports = getFilteredReports().sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

  return (
    <div className="triage-dashboard-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <aside className="triage-sidebar">
          <div className="sidebar-menu">
            <div className="sidebar-item active">
              <span className="sidebar-icon">🔍</span>
              <span className="sidebar-label">Review Queue</span>
            </div>
            <div className="sidebar-item" onClick={() => alert('Analytics page coming soon!')}>
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-label">Analytics</span>
            </div>
            <div className="sidebar-item" onClick={() => alert('Settings page coming soon!')}>
              <span className="sidebar-icon">⚙️</span>
              <span className="sidebar-label">Settings</span>
            </div>
          </div>
        </aside>
        
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Triage Dashboard</h1>
              <p className="dashboard-subtitle">Welcome back, {currentUser?.fullName}</p>
            </div>
            <div className="header-actions">
              <span className="priority-indicator">🔥 {stats.pendingReports} reports need review</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalReports}</div>
                <div className="stat-label">Total Reports</div>
              </div>
            </div>

            <div className="stat-card urgent">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <div className="stat-value">{stats.pendingReports}</div>
                <div className="stat-label">Pending Review</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔍</div>
              <div className="stat-info">
                <div className="stat-value">{stats.inReviewReports}</div>
                <div className="stat-label">In Review</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <div className="stat-value">{stats.reviewedToday}</div>
                <div className="stat-label">Reviewed Today</div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="triage-filters">
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({stats.pendingReports})
            </button>
            <button
              className={`filter-btn ${filter === 'reviewing' ? 'active' : ''}`}
              onClick={() => setFilter('reviewing')}
            >
              In Review ({stats.inReviewReports})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Reports
            </button>
          </div>

          {/* Reports Queue */}
          <div className="reports-queue">
            {filteredReports.length > 0 ? (
              <div className="queue-list">
                {filteredReports.map(report => {
                  const company = getCompanyById(report.companyId);
                  const priorityScore = getPriorityScore(report);
                  
                  return (
                    <div key={report.id} className={`queue-item ${priorityScore > 4 ? 'high-priority' : ''}`}>
                      <div className="queue-header">
                        <div className="report-meta">
                          <span className="company-name">{company?.name || 'Unknown Company'}</span>
                          <span className={`severity-badge ${getSeverityColor(report.severity)}`}>
                            {report.severity}
                          </span>
                          <span className="report-age">
                            {Math.floor((Date.now() - new Date(report.submittedAt)) / (1000 * 60 * 60))}h ago
                          </span>
                        </div>
                        <div className="queue-actions">
                          <span className={`status-badge ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                          {priorityScore > 4 && <span className="priority-flag">🔥</span>}
                        </div>
                      </div>
                      
                      <h3 className="report-title">{report.title}</h3>
                      <div className="report-details">
                        <span className="vulnerability-type">{report.vulnerabilityType}</span>
                        <span className="researcher">by @{report.username}</span>
                      </div>
                      
                      <p className="report-description">
                        {report.description?.substring(0, 200)}...
                      </p>

                      {report.status === 'Pending Review' && (
                        <div className="triage-actions">
                          <button
                            onClick={() => handleStatusChange(report.id, 'In Review')}
                            className="btn btn-secondary btn-sm"
                          >
                            Start Review
                          </button>
                          <Link to={`/triage-review/${report.id}`} className="btn btn-primary btn-sm">
                            Full Review →
                          </Link>
                        </div>
                      )}

                      {report.status === 'In Review' && (
                        <div className="triage-actions">
                          <button
                            onClick={() => {
                              const reward = prompt('Enter bounty amount (if accepting):');
                              const feedback = prompt('Enter feedback:');
                              if (reward && feedback) {
                                handleStatusChange(report.id, 'Accepted', Number(reward), feedback);
                              }
                            }}
                            className="btn btn-success btn-sm"
                          >
                            Accept & Pay
                          </button>
                          <button
                            onClick={() => {
                              const feedback = prompt('Enter rejection reason:');
                              if (feedback) {
                                handleStatusChange(report.id, 'Rejected', null, feedback);
                              }
                            }}
                            className="btn btn-danger btn-sm"
                          >
                            Reject
                          </button>
                          <Link to={`/triage-review/${report.id}`} className="btn btn-secondary btn-sm">
                            Detailed Review
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-reports">
                <div className="no-reports-icon">🎉</div>
                <h3>No Reports in Queue</h3>
                <p>All caught up! No reports to review right now.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TriageDashboard;
