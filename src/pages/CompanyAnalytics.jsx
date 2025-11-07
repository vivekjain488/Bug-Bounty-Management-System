import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import { isCompany, getCurrentUser } from '../utils/auth';
import { getAllReports } from '../utils/reports';

const CompanyAnalytics = () => {
  const currentUser = getCurrentUser();
  const [reports, setReports] = useState([]);
  const [timeframe, setTimeframe] = useState('month');
  const [analytics, setAnalytics] = useState({
    totalReports: 0,
    totalPaid: 0,
    avgBounty: 0,
    criticalFixed: 0,
    byCategory: {},
    bySeverity: {},
    topResearchers: [],
    monthlyTrend: [],
    recentPayments: []
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      const allReports = await getAllReports();
      if (!Array.isArray(allReports)) return;

      // Filter company's reports
      const companyReports = allReports.filter(r => r.companyId === currentUser._id?.toString() || r.companyId === currentUser.id?.toString());
      const filteredReports = filterByTimeframe(companyReports);
      setReports(filteredReports);

      // Calculate metrics
      const acceptedReports = filteredReports.filter(r => r.status === 'Accepted');
      const totalPaid = acceptedReports.reduce((sum, r) => sum + (r.reward || 0), 0);
      const avgBounty = acceptedReports.length > 0 ? (totalPaid / acceptedReports.length).toFixed(0) : 0;
      const criticalFixed = filteredReports.filter(r => r.severity === 'Critical' && r.status === 'Accepted').length;

      // Category distribution
      const byCategory = {};
      filteredReports.forEach(r => {
        const cat = r.category || r.vulnerabilityType || 'Other';
        byCategory[cat] = (byCategory[cat] || 0) + 1;
      });

      // Severity distribution  
      const bySeverity = {
        Critical: filteredReports.filter(r => r.severity === 'Critical').length,
        High: filteredReports.filter(r => r.severity === 'High').length,
        Medium: filteredReports.filter(r => r.severity === 'Medium').length,
        Low: filteredReports.filter(r => r.severity === 'Low').length,
      };

      // Top researchers
      const researcherEarnings = {};
      acceptedReports.forEach(r => {
        const username = r.userId?.username || r.username || 'Unknown';
        if (!researcherEarnings[username]) {
          researcherEarnings[username] = { reports: 0, earnings: 0 };
        }
        researcherEarnings[username].reports++;
        researcherEarnings[username].earnings += r.reward || 0;
      });

      const topResearchers = Object.entries(researcherEarnings)
        .map(([username, data]) => ({ username, ...data }))
        .sort((a, b) => b.earnings - a.earnings)
        .slice(0, 5);

      // Recent payments
      const recentPayments = acceptedReports
        .sort((a, b) => new Date(b.updatedAt || b.submittedAt) - new Date(a.updatedAt || a.submittedAt))
        .slice(0, 10);

      setAnalytics({
        totalReports: filteredReports.length,
        totalPaid,
        avgBounty,
        criticalFixed,
        byCategory,
        bySeverity,
        topResearchers,
        recentPayments
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
        return reports;
    }

    return reports.filter(r => new Date(r.submittedAt || r.createdAt) >= cutoff);
  };

  if (!isCompany()) {
    return <Navigate to="/company-login" />;
  }

  return (
    <div className="company-analytics-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className="dashboard-main">
          <div className="analytics-container">
            <div className="analytics-header">
              <div>
                <h1 className="dashboard-title">Security Analytics</h1>
                <p className="dashboard-subtitle">Vulnerability insights and trends</p>
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
                <div className="stat-icon">🐛</div>
                <div className="stat-info">
                  <div className="stat-value">{analytics.totalReports}</div>
                  <div className="stat-label">Total Reports</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-value">${analytics.totalPaid.toLocaleString()}</div>
                  <div className="stat-label">Total Bounties Paid</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <div className="stat-value">${analytics.avgBounty}</div>
                  <div className="stat-label">Avg Bounty</div>
                </div>
              </div>

              <div className="stat-card urgent">
                <div className="stat-icon">🚨</div>
                <div className="stat-info">
                  <div className="stat-value">{analytics.criticalFixed}</div>
                  <div className="stat-label">Critical Fixed</div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
              <div className="chart-card">
                <h2 className="section-heading">Vulnerability Types</h2>
                <div className="chart-bars">
                  {Object.entries(analytics.byCategory).map(([category, count]) => (
                    <div key={category} className="chart-bar-row">
                      <span className="chart-label">{category}</span>
                      <div className="chart-bar-container">
                        <div
                          className="chart-bar category-bar"
                          style={{ width: `${(count / Math.max(...Object.values(analytics.byCategory), 1)) * 100}%` }}
                        >
                          <span className="chart-bar-value">{count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <h2 className="section-heading">Severity Breakdown</h2>
                <div className="chart-bars">
                  {Object.entries(analytics.bySeverity).map(([severity, count]) => (
                    <div key={severity} className="chart-bar-row">
                      <span className="chart-label">{severity}</span>
                      <div className="chart-bar-container">
                        <div
                          className={`chart-bar severity-${severity.toLowerCase()}`}
                          style={{ width: `${(count / Math.max(...Object.values(analytics.bySeverity), 1)) * 100}%` }}
                        >
                          <span className="chart-bar-value">{count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Researchers */}
            <div className="leaderboard-card">
              <h2 className="section-heading">🏆 Top Contributing Researchers</h2>
              <div className="leaderboard-list">
                {analytics.topResearchers.length > 0 ? (
                  analytics.topResearchers.map((researcher, index) => (
                    <div key={researcher.username} className="leaderboard-item">
                      <span className="rank">#{index + 1}</span>
                      <div className="researcher-info">
                        <strong>@{researcher.username}</strong>
                        <span className="researcher-stats">
                          {researcher.reports} reports • ${researcher.earnings.toLocaleString()} earned
                        </span>
                      </div>
                      <Link to="/company-payments" className="btn btn-sm btn-secondary">
                        Pay Now
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No accepted reports yet</p>
                )}
              </div>
            </div>

            {/* Recent Payments */}
            <div className="recent-activity-card">
              <h2 className="section-heading">Recent Bounty Payments</h2>
              <div className="activity-list">
                {analytics.recentPayments.length > 0 ? (
                  analytics.recentPayments.map((report) => (
                    <div key={report._id || report.id} className="activity-item">
                      <div className="activity-icon">💰</div>
                      <div className="activity-details">
                        <strong>{report.title}</strong>
                        <span className="activity-meta">
                          @{report.userId?.username || report.username} • 
                          ${(report.reward || 0).toLocaleString()} • 
                          {new Date(report.updatedAt || report.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`severity-badge severity-${(report.severity || 'medium').toLowerCase()}`}>
                        {report.severity}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No payments yet</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyAnalytics;
