import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { isCompany, getCurrentUser } from '../utils/auth';
import { getAllReports } from '../utils/reports';
import { getCompanyById } from '../utils/mockData';

const CompanyDashboard = () => {
  const currentUser = getCurrentUser();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    acceptedReports: 0,
    totalBountyPaid: 0
  });

  useEffect(() => {
    if (currentUser) {
      loadCompanyReports();
    }
  }, [currentUser]);

  const loadCompanyReports = () => {
    // For demo, we'll show all reports but in real app this would be filtered by company
    const allReports = getAllReports();
    setReports(allReports);
    
    const totalReports = allReports.length;
    const pendingReports = allReports.filter(r => r.status === 'Pending Review').length;
    const acceptedReports = allReports.filter(r => r.status === 'Accepted').length;
    const totalBountyPaid = allReports
      .filter(r => r.status === 'Accepted' && r.reward)
      .reduce((sum, r) => sum + r.reward, 0);

    setStats({
      totalReports,
      pendingReports,
      acceptedReports,
      totalBountyPaid
    });
  };

  if (!isCompany()) {
    return <Navigate to="/company-login" />;
  }

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

  return (
    <div className="company-dashboard-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <aside className="company-sidebar">
          <div className="sidebar-menu">
            <div className="sidebar-item active">
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-label">Dashboard</span>
            </div>
            <Link to="/create-program" className="sidebar-item">
              <span className="sidebar-icon">🚀</span>
              <span className="sidebar-label">Create Program</span>
            </Link>
            <div className="sidebar-item" onClick={() => alert('My Programs page coming soon!')}>
              <span className="sidebar-icon">🏢</span>
              <span className="sidebar-label">My Programs</span>
            </div>
            <Link to="/company-reports" className="sidebar-item">
              <span className="sidebar-icon">📋</span>
              <span className="sidebar-label">Reports</span>
            </Link>
            <Link to="/company-payments" className="sidebar-item">
              <span className="sidebar-icon">💰</span>
              <span className="sidebar-label">Payments</span>
            </Link>
            <div className="sidebar-item" onClick={() => alert('Settings page coming soon!')}>
              <span className="sidebar-icon">⚙️</span>
              <span className="sidebar-label">Settings</span>
            </div>
          </div>
        </aside>
        
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Company Dashboard</h1>
              <p className="dashboard-subtitle">Welcome back, {currentUser?.companyName || currentUser?.fullName}</p>
            </div>
            <Link to="/create-program" className="btn btn-primary">
              🚀 Create New Program
            </Link>
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

            <div className="stat-card">
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
                <div className="stat-label">Accepted Reports</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <div className="stat-value">${stats.totalBountyPaid.toLocaleString()}</div>
                <div className="stat-label">Total Bounty Paid</div>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="reports-section">
            <div className="section-header">
              <h2 className="section-title">Recent Reports</h2>
              <Link to="/company-reports" className="btn btn-secondary">View All</Link>
            </div>

            {reports.length > 0 ? (
              <div className="reports-table">
                <div className="table-header">
                  <div className="table-cell">Report</div>
                  <div className="table-cell">Researcher</div>
                  <div className="table-cell">Severity</div>
                  <div className="table-cell">Status</div>
                  <div className="table-cell">Date</div>
                  <div className="table-cell">Actions</div>
                </div>
                
                {reports.slice(0, 5).map(report => {
                  const company = getCompanyById(report.companyId);
                  return (
                    <div key={report.id} className="table-row">
                      <div className="table-cell">
                        <div className="report-info">
                          <div className="report-title">{report.title}</div>
                          <div className="report-type">{report.vulnerabilityType}</div>
                        </div>
                      </div>
                      <div className="table-cell">
                        <div className="researcher-info">
                          <div className="researcher-avatar">{report.username?.[0]?.toUpperCase()}</div>
                          <span className="researcher-name">@{report.username}</span>
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
                        {new Date(report.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="table-cell">
                        <Link to={`/company-report/${report.id}`} className="btn btn-sm btn-secondary">
                          Review
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-reports">
                <div className="no-reports-icon">📭</div>
                <h3>No Reports Yet</h3>
                <p>Reports submitted to your programs will appear here.</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-title">Quick Actions</h2>
            <div className="actions-grid">
              <div className="action-card">
                <div className="action-icon">🚀</div>
                <h3>Create Program</h3>
                <p>Launch a new bug bounty program</p>
                <Link to="/create-program" className="btn btn-primary btn-sm">Create</Link>
              </div>
              
              <div className="action-card">
                <div className="action-icon">📊</div>
                <h3>View Analytics</h3>
                <p>Analyze your security metrics</p>
                <Link to="/company-analytics" className="btn btn-secondary btn-sm">View</Link>
              </div>
              
              <div className="action-card">
                <div className="action-icon">💰</div>
                <h3>Manage Payments</h3>
                <p>Process bounty payments</p>
                <Link to="/company-payments" className="btn btn-secondary btn-sm">Manage</Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;
