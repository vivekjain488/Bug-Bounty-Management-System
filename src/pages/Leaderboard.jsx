import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { getAllReports } from '../utils/reports';

const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState('all');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      const reports = await getAllReports();
      
      if (!Array.isArray(reports)) {
        setLoading(false);
        return;
      }

      // Filter by timeframe
      const filteredReports = filterByTimeframe(reports);
      
      // Calculate researcher stats
      const researcherStats = {};
      filteredReports.forEach(report => {
        const username = report.userId?.username || report.username || 'Anonymous';
        if (!researcherStats[username]) {
          researcherStats[username] = {
            username,
            totalReports: 0,
            accepted: 0,
            rejected: 0,
            pending: 0,
            earnings: 0,
            criticalFinds: 0,
            highFinds: 0
          };
        }
        
        researcherStats[username].totalReports++;
        
        if (report.status === 'Accepted') {
          researcherStats[username].accepted++;
          researcherStats[username].earnings += report.reward || 0;
        } else if (report.status === 'Rejected') {
          researcherStats[username].rejected++;
        } else {
          researcherStats[username].pending++;
        }
        
        if (report.severity === 'Critical') researcherStats[username].criticalFinds++;
        if (report.severity === 'High') researcherStats[username].highFinds++;
      });

      // Sort by earnings
      const sortedLeaderboard = Object.values(researcherStats)
        .sort((a, b) => b.earnings - a.earnings)
        .map((researcher, index) => ({
          ...researcher,
          rank: index + 1,
          acceptanceRate: researcher.totalReports > 0 
            ? ((researcher.accepted / researcher.totalReports) * 100).toFixed(1)
            : 0
        }));

      setLeaderboard(sortedLeaderboard);
      setLoading(false);
    };

    loadLeaderboard();
  }, [timeframe]);

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

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return '';
  };

  return (
    <div className="leaderboard-page">
      <Navbar />
      
      <div className="leaderboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">🏆 Researcher Leaderboard</h1>
          <p className="hero-subtitle">
            Top security researchers ranked by bounties earned and vulnerabilities discovered
          </p>
        </div>
      </div>

      <div className="leaderboard-container">
        <div className="leaderboard-controls">
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

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading leaderboard...</p>
          </div>
        ) : leaderboard.length > 0 ? (
          <>
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="podium">
                {/* Second Place */}
                <div className="podium-place podium-second">
                  <div className="podium-rank">🥈</div>
                  <div className="podium-avatar">👤</div>
                  <div className="podium-info">
                    <h3>@{leaderboard[1].username}</h3>
                    <p className="podium-earnings">${leaderboard[1].earnings.toLocaleString()}</p>
                    <p className="podium-stats">{leaderboard[1].accepted} accepted reports</p>
                  </div>
                </div>

                {/* First Place */}
                <div className="podium-place podium-first">
                  <div className="podium-rank">🥇</div>
                  <div className="podium-avatar">👤</div>
                  <div className="podium-info">
                    <h3>@{leaderboard[0].username}</h3>
                    <p className="podium-earnings">${leaderboard[0].earnings.toLocaleString()}</p>
                    <p className="podium-stats">{leaderboard[0].accepted} accepted reports</p>
                  </div>
                </div>

                {/* Third Place */}
                <div className="podium-place podium-third">
                  <div className="podium-rank">🥉</div>
                  <div className="podium-avatar">👤</div>
                  <div className="podium-info">
                    <h3>@{leaderboard[2].username}</h3>
                    <p className="podium-earnings">${leaderboard[2].earnings.toLocaleString()}</p>
                    <p className="podium-stats">{leaderboard[2].accepted} accepted reports</p>
                  </div>
                </div>
              </div>
            )}

            {/* Full Leaderboard Table */}
            <div className="leaderboard-table-container">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Researcher</th>
                    <th>Total Earnings</th>
                    <th>Reports</th>
                    <th>Acceptance Rate</th>
                    <th>Critical</th>
                    <th>High</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((researcher) => (
                    <tr key={researcher.username} className={getRankClass(researcher.rank)}>
                      <td>
                        <span className="rank-badge">{getRankBadge(researcher.rank)}</span>
                      </td>
                      <td>
                        <div className="researcher-cell">
                          <div className="researcher-avatar">👤</div>
                          <strong>@{researcher.username}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="earnings-value">${researcher.earnings.toLocaleString()}</span>
                      </td>
                      <td>
                        <span className="reports-count">{researcher.totalReports}</span>
                        <span className="reports-breakdown">
                          ({researcher.accepted} accepted)
                        </span>
                      </td>
                      <td>
                        <span className="acceptance-rate">{researcher.acceptanceRate}%</span>
                      </td>
                      <td>
                        <span className="severity-badge severity-critical-sm">{researcher.criticalFinds}</span>
                      </td>
                      <td>
                        <span className="severity-badge severity-high-sm">{researcher.highFinds}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="no-data-state">
            <div className="no-data-icon">📊</div>
            <h3>No Data Available</h3>
            <p>No researchers found for the selected timeframe</p>
          </div>
        )}
      </div>

      <div className="leaderboard-cta">
        <h2>Want to see your name here?</h2>
        <p>Join thousands of security researchers and start earning bounties today</p>
        <Link to="/signup" className="btn btn-primary btn-large">
          Get Started →
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default Leaderboard;
