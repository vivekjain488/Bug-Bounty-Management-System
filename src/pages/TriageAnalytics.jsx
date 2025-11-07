import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { isTriageTeam, getCurrentUser } from '../utils/auth';
import { getAllReports } from '../utils/reports';

const TriageAnalytics = () => {
  const currentUser = getCurrentUser();
  const [reports, setReports] = useState([]);
  const [timeframe, setTimeframe] = useState('week'); // week, month, year, all
  const [analytics, setAnalytics] = useState({
    totalReports: 0,
    avgResponseTime: 0,
    acceptanceRate: 0,
    totalPaid: 0,
    bySecurityTrends: [],
    bySeverityDist: {},
    byStatusDist: {},
    topResearchers: [],
    topCompanies: [],
    recentActivity: []
  });

  useEffect(() => {
    const loadAnalytics = async () => {
    const allReports = await getAllReports();
    if (!Array.isArray(allReports)) {
      console.error('getAllReports did not return an array');
      return;
    }

    // Filter by timeframe
    const filteredReports = filterByTimeframe(allReports);
    setReports(filteredReports);

    // Calculate analytics
    const totalReports = filteredReports.length;
    const acceptedReports = filteredReports.filter(r => r.status === 'Accepted').length;
    const acceptanceRate = totalReports > 0 ? ((acceptedReports / totalReports) * 100).toFixed(1) : 0;
    
    const totalPaid = filteredReports
      .filter(r => r.status === 'Accepted' && r.reward)
      .reduce((sum, r) => sum + (r.reward || 0), 0);

    // Average response time (in hours)
    const responseTimes = filteredReports
      .filter(r => r.updatedAt && r.submittedAt)
      .map(r => (new Date(r.updatedAt) - new Date(r.submittedAt)) / (1000 * 60 * 60));
    const avgResponseTime = responseTimes.length > 0 
      ? (responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length).toFixed(1)
      : 0;

    // Severity distribution
    const bySeverityDist = {
      Critical: filteredReports.filter(r => r.severity === 'Critical').length,
      High: filteredReports.filter(r => r.severity === 'High').length,
      Medium: filteredReports.filter(r => r.severity === 'Medium').length,
      Low: filteredReports.filter(r => r.severity === 'Low').length,
    };

    // Status distribution
    const byStatusDist = {
      'Pending Review': filteredReports.filter(r => r.status === 'Pending Review').length,
      'In Review': filteredReports.filter(r => r.status === 'In Review').length,
      'Accepted': filteredReports.filter(r => r.status === 'Accepted').length,
      'Rejected': filteredReports.filter(r => r.status === 'Rejected').length,
    };

    // Top researchers (by accepted reports)
    const researcherStats = {};
    filteredReports.forEach(r => {
      const username = r.userId?.username || r.username || 'Unknown';
      if (!researcherStats[username]) {
        researcherStats[username] = { reports: 0, accepted: 0, earnings: 0 };
      }
      researcherStats[username].reports++;
      if (r.status === 'Accepted') {
        researcherStats[username].accepted++;
        researcherStats[username].earnings += r.reward || 0;
      }
    });

    const topResearchers = Object.entries(researcherStats)
      .map(([username, stats]) => ({ username, ...stats }))
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5);

    // Top companies (by reports received)
    const companyStats = {};
    filteredReports.forEach(r => {
      const companyId = r.companyId || 'Unknown';
      if (!companyStats[companyId]) {
        companyStats[companyId] = { reports: 0, paid: 0 };
      }
      companyStats[companyId].reports++;
      if (r.status === 'Accepted') {
        companyStats[companyId].paid += r.reward || 0;
      }
    });

    const topCompanies = Object.entries(companyStats)
      .map(([companyId, stats]) => ({ companyId, ...stats }))
      .sort((a, b) => b.reports - a.reports)
      .slice(0, 5);

    // Recent activity
    const recentActivity = filteredReports
      .sort((a, b) => new Date(b.updatedAt || b.submittedAt) - new Date(a.updatedAt || a.submittedAt))
      .slice(0, 10);

    setAnalytics({
      totalReports,
      avgResponseTime,
      acceptanceRate,
      totalPaid,
      bySeverityDist,
      byStatusDist,
      topResearchers,
      topCompanies,
      recentActivity
    });
    };

    if (currentUser) {
      loadAnalytics();
    }
  }, [currentUser, timeframe]);

  const filterByTimeframe = (reports) => {
    const now = new Date();
    const cutoff = new Date();

    switch (timeframe) {
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return reports; // 'all'
    }

    return reports.filter(r => new Date(r.submittedAt || r.createdAt) >= cutoff);
  };

  if (!isTriageTeam()) {
    return <Navigate to="/triage-login" />;
  }

  return (
    <div className="triage-analytics-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <aside className="triage-sidebar">
          <div className="sidebar-menu">
            <Link to="/triage-dashboard" className="sidebar-item">
              <span className="sidebar-icon">🔍</span>
              <span className="sidebar-label">Review Queue</span>
            </Link>
            <div className="sidebar-item active">
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-label">Analytics</span>
            </div>
            <Link to="/triage-settings" className="sidebar-item">
              <span className="sidebar-icon">⚙️</span>
              <span className="sidebar-label">Settings</span>
            </Link>
          </div>
        </aside>
        
        <main className="dashboard-main">
          <div className="analytics-container">
            <div className="analytics-header">
              <div>
                <h1 className="dashboard-title">Analytics Dashboard</h1>
                <p className="dashboard-subtitle">Platform performance and insights</p>
              </div>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="form-input timeframe-select"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {/* Key Metrics */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <div className="stat-value">{analytics.totalReports}</div>
                  <div className="stat-label">Total Reports</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-info">
                  <div className="stat-value">{analytics.avgResponseTime}h</div>
                  <div className="stat-label">Avg Response Time</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <div className="stat-value">{analytics.acceptanceRate}%</div>
                  <div className="stat-label">Acceptance Rate</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-value">${analytics.totalPaid.toLocaleString()}</div>
                  <div className="stat-label">Total Bounties Paid</div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="charts-grid">
              {/* Severity Distribution */}
              <div className="chart-card">
                <h2 className="section-heading">Severity Distribution</h2>
                <div className="chart-bars">
                  {Object.entries(analytics.bySeverityDist).map(([severity, count]) => (
                    <div key={severity} className="chart-bar-row">
                      <span className="chart-label">{severity}</span>
                      <div className="chart-bar-container">
                        <div
                          className={`chart-bar severity-${severity.toLowerCase()}`}
                          style={{ width: `${(count / Math.max(...Object.values(analytics.bySeverityDist), 1)) * 100}%` }}
                        >
                          <span className="chart-bar-value">{count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Distribution */}
              <div className="chart-card">
                <h2 className="section-heading">Status Distribution</h2>
                <div className="chart-bars">
                  {Object.entries(analytics.byStatusDist).map(([status, count]) => (
                    <div key={status} className="chart-bar-row">
                      <span className="chart-label">{status}</span>
                      <div className="chart-bar-container">
                        <div
                          className="chart-bar status-bar"
                          style={{ width: `${(count / Math.max(...Object.values(analytics.byStatusDist), 1)) * 100}%` }}
                        >
                          <span className="chart-bar-value">{count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Leaderboards */}
            <div className="leaderboards-grid">
              {/* Top Researchers */}
              <div className="leaderboard-card">
                <h2 className="section-heading">🏆 Top Researchers</h2>
                <div className="leaderboard-list">
                  {analytics.topResearchers.length > 0 ? (
                    analytics.topResearchers.map((researcher, index) => (
                      <div key={researcher.username} className="leaderboard-item">
                        <span className="rank">#{index + 1}</span>
                        <div className="researcher-info">
                          <strong>@{researcher.username}</strong>
                          <span className="researcher-stats">
                            {researcher.accepted} accepted • ${researcher.earnings.toLocaleString()} earned
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No researchers yet</p>
                  )}
                </div>
              </div>

              {/* Top Companies */}
              <div className="leaderboard-card">
                <h2 className="section-heading">🏢 Most Active Companies</h2>
                <div className="leaderboard-list">
                  {analytics.topCompanies.length > 0 ? (
                    analytics.topCompanies.map((company, index) => (
                      <div key={company.companyId} className="leaderboard-item">
                        <span className="rank">#{index + 1}</span>
                        <div className="researcher-info">
                          <strong>Company #{company.companyId}</strong>
                          <span className="researcher-stats">
                            {company.reports} reports • ${company.paid.toLocaleString()} paid
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No companies yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-card">
              <h2 className="section-heading">Recent Activity</h2>
              <div className="activity-list">
                {analytics.recentActivity.length > 0 ? (
                  analytics.recentActivity.map((report) => (
                    <div key={report._id || report.id} className="activity-item">
                      <div className="activity-icon">
                        {report.status === 'Accepted' ? '✅' : 
                         report.status === 'Rejected' ? '❌' :
                         report.status === 'In Review' ? '🔍' : '⏳'}
                      </div>
                      <div className="activity-details">
                        <strong>{report.title}</strong>
                        <span className="activity-meta">
                          {report.severity} • {report.status} • 
                          {new Date(report.updatedAt || report.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Link 
                        to={`/triage-review/${report._id || report.id}`}
                        className="btn btn-sm btn-secondary"
                      >
                        View
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TriageAnalytics;
