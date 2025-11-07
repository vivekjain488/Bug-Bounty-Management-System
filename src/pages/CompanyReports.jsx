import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { isCompany, getCurrentUser } from '../utils/auth';
import { getAllReports, updateReportStatus } from '../utils/reports';
import { getUserPrograms } from '../utils/programs';

const CompanyReports = () => {
  const currentUser = getCurrentUser();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({});

  useEffect(() => {
    const loadReports = async () => {
      try {
        // Get all reports for this company's programs from MongoDB
        const userPrograms = await getUserPrograms(currentUser.id);
        const programIds = userPrograms.map(p => p.id || p._id);
        const allReports = await getAllReports();
        
        // Ensure allReports is an array
        if (!Array.isArray(allReports)) {
          console.error('getAllReports did not return an array:', allReports);
          setReports([]);
          return;
        }
        
        const companyReports = allReports.filter(r => programIds.includes(r.companyId || r.program));
      
        setReports(companyReports.sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt)));
      
      // Calculate stats
      const totalReports = companyReports.length;
      const pendingReports = companyReports.filter(r => r.status === 'Pending Review').length;
      const inReviewReports = companyReports.filter(r => r.status === 'In Review').length;
      const acceptedReports = companyReports.filter(r => r.status === 'Accepted').length;
      const rejectedReports = companyReports.filter(r => r.status === 'Rejected').length;
      const totalBountyPaid = companyReports
        .filter(r => r.status === 'Accepted' && r.reward)
        .reduce((sum, r) => sum + r.reward, 0);

      setStats({
        totalReports,
        pendingReports,
        inReviewReports,
        acceptedReports,
        rejectedReports,
        totalBountyPaid
      });
      } catch (error) {
        console.error('Error loading reports:', error);
        setReports([]);
      }
    };

    if (currentUser) {
      loadReports();
    }
  }, [currentUser]);

  if (!isCompany()) {
    return <Navigate to="/company-login" />;
  }

  const getFilteredReports = () => {
    switch (filter) {
      case 'pending':
        return reports.filter(r => r.status === 'Pending Review');
      case 'review':
        return reports.filter(r => r.status === 'In Review');
      case 'accepted':
        return reports.filter(r => r.status === 'Accepted');
      case 'rejected':
        return reports.filter(r => r.status === 'Rejected');
      default:
        return reports;
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

  const filteredReports = getFilteredReports();

  return (
    <div className="company-reports-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <aside className="company-sidebar">
          <div className="sidebar-menu">
            <Link to="/company-dashboard" className="sidebar-item">
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-label">Dashboard</span>
            </Link>
            <Link to="/create-program" className="sidebar-item">
              <span className="sidebar-icon">🚀</span>
              <span className="sidebar-label">Create Program</span>
            </Link>
            <div className="sidebar-item">
              <span className="sidebar-icon">🏢</span>
              <span className="sidebar-label">My Programs</span>
            </div>
            <div className="sidebar-item active">
              <span className="sidebar-icon">📋</span>
              <span className="sidebar-label">Reports</span>
            </div>
            <Link to="/company-payments" className="sidebar-item">
              <span className="sidebar-icon">💰</span>
              <span className="sidebar-label">Payments</span>
            </Link>
          </div>
        </aside>
        
        <main className="dashboard-main">
          <div className="reports-container">
            <div className="dashboard-header">
              <div>
                <h1 className="dashboard-title">Security Reports</h1>
                <p className="dashboard-subtitle">Manage vulnerability reports for your programs</p>
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
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.acceptedReports}</div>
                  <div className="stat-label">Accepted</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-value">${stats.totalBountyPaid?.toLocaleString()}</div>
                  <div className="stat-label">Bounty Paid</div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="reports-filters">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Reports ({reports.length})
              </button>
              <button
                className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({stats.pendingReports || 0})
              </button>
              <button
                className={`filter-btn ${filter === 'review' ? 'active' : ''}`}
                onClick={() => setFilter('review')}
              >
                In Review ({stats.inReviewReports || 0})
              </button>
              <button
                className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
                onClick={() => setFilter('accepted')}
              >
                Accepted ({stats.acceptedReports || 0})
              </button>
              <button
                className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilter('rejected')}
              >
                Rejected ({stats.rejectedReports || 0})
              </button>
            </div>

            {/* Reports List */}
            {filteredReports.length > 0 ? (
              <div className="reports-table">
                <div className="table-header">
                  <div className="table-cell">Report Details</div>
                  <div className="table-cell">Researcher</div>
                  <div className="table-cell">Severity</div>
                  <div className="table-cell">Status</div>
                  <div className="table-cell">Submitted</div>
                  <div className="table-cell">Actions</div>
                </div>
                
                {filteredReports.map(report => {
                  const reportId = report._id || report.id;
                  const username = report.username || 
                                  (typeof report.userId === 'object' ? report.userId?.username : report.userId) || 
                                  'Anonymous';
                  
                  return (
                    <div key={reportId} className="table-row">
                      <div className="table-cell">
                        <div className="report-info">
                          <div className="report-title">{report.title}</div>
                          <div className="report-type">{report.vulnerabilityType || report.category}</div>
                        </div>
                      </div>
                      <div className="table-cell">
                        <div className="researcher-info">
                          <div className="researcher-avatar">{username[0]?.toUpperCase()}</div>
                          <span className="researcher-name">@{username}</span>
                        </div>
                      </div>
                      <div className="table-cell">
                        <span className={`severity-badge ${getSeverityColor(report.severity)}`}>
                          {report.severity}
                        </span>
                      </div>
                      <div className="table-cell">
                        <span className={`status-badge ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="table-cell">
                        {new Date(report.submittedAt || report.createdAt).toLocaleDateString()}
                      </div>
                      <div className="table-cell">
                        <Link to={`/triage-review/${reportId}`} className="btn btn-sm btn-secondary">
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-reports">
                <div className="no-reports-icon">📭</div>
                <h3>No Reports Found</h3>
                <p>
                  {filter === 'all' 
                    ? "No reports submitted to your programs yet."
                    : `No reports with "${filter}" status.`}
                </p>
                <Link to="/create-program" className="btn btn-primary btn-large">
                  Create Your First Program →
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyReports;
