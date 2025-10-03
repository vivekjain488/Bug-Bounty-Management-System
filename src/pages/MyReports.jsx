import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import ReportCard from '../shared/ReportCard';
import { isAuthenticated, getCurrentUser } from '../utils/auth';
import { getUserReports, getReportStats } from '../utils/reports';
import { getCompanyById } from '../utils/mockData';

const MyReports = () => {
  const currentUser = getCurrentUser();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (currentUser) {
      const userReports = getUserReports(currentUser.id);
      setReports(userReports.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
      setStats(getReportStats(currentUser.id));
    }
  }, [currentUser]);

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const getFilteredReports = () => {
    if (filter === 'all') return reports;
    return reports.filter(report => {
      switch (filter) {
        case 'pending':
          return report.status === 'Pending Review';
        case 'review':
          return report.status === 'In Review';
        case 'accepted':
          return report.status === 'Accepted';
        case 'rejected':
          return report.status === 'Rejected';
        default:
          return true;
      }
    });
  };

  const filteredReports = getFilteredReports();

  return (
    <div className="my-reports-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className="dashboard-main">
          <div className="reports-container">
            <div className="reports-header">
              <div>
                <h1 className="dashboard-title">My Reports</h1>
                <p className="dashboard-subtitle">Track your submitted vulnerability reports</p>
              </div>
              <Link to="/companies" className="btn btn-primary">
                🐛 Report New Bug
              </Link>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="reports-stats">
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Reports</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.pending}</div>
                    <div className="stat-label">Pending Review</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🔍</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.inReview}</div>
                    <div className="stat-label">In Review</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.accepted}</div>
                    <div className="stat-label">Accepted</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">❌</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.rejected}</div>
                    <div className="stat-label">Rejected</div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Buttons */}
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
                Pending ({stats?.pending || 0})
              </button>
              <button
                className={`filter-btn ${filter === 'review' ? 'active' : ''}`}
                onClick={() => setFilter('review')}
              >
                In Review ({stats?.inReview || 0})
              </button>
              <button
                className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
                onClick={() => setFilter('accepted')}
              >
                Accepted ({stats?.accepted || 0})
              </button>
              <button
                className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilter('rejected')}
              >
                Rejected ({stats?.rejected || 0})
              </button>
            </div>

            {/* Reports Grid */}
            {filteredReports.length > 0 ? (
              <div className="reports-grid">
                {filteredReports.map(report => {
                  const company = getCompanyById(report.companyId);
                  return <ReportCard key={report.id} report={report} company={company} />;
                })}
              </div>
            ) : (
              <div className="no-reports">
                <div className="no-reports-icon">📭</div>
                <h3 className="no-reports-title">No Reports Found</h3>
                <p className="no-reports-text">
                  {filter === 'all' 
                    ? "You haven't submitted any reports yet. Start hunting bugs and earn bounties!"
                    : `No reports with "${filter}" status.`}
                </p>
                <Link to="/companies" className="btn btn-primary btn-large">
                  Browse Companies →
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyReports;

