import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { isCompany, getCurrentUser } from '../utils/auth';
import { getAllReports } from '../utils/reports';
import { getUserPrograms } from '../utils/programs';

const CompanyPayments = () => {
  const currentUser = getCurrentUser();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalPaid: 0,
    pendingPayments: 0,
    thisMonth: 0,
    averagePayment: 0
  });

  useEffect(() => {
    if (currentUser) {
      loadPayments();
    }
  }, [currentUser]);

  const loadPayments = () => {
    // Get accepted reports that have rewards
    const userPrograms = getUserPrograms(currentUser.id);
    const programIds = userPrograms.map(p => p.id);
    const allReports = getAllReports();
    const acceptedReports = allReports.filter(r => 
      programIds.includes(r.companyId) && 
      r.status === 'Accepted' && 
      r.reward
    );

    setPayments(acceptedReports.sort((a, b) => new Date(b.updatedAt || b.submittedAt) - new Date(a.updatedAt || a.submittedAt)));

    // Calculate stats
    const totalPaid = acceptedReports.reduce((sum, r) => sum + r.reward, 0);
    const pendingPayments = allReports.filter(r => 
      programIds.includes(r.companyId) && 
      r.status === 'Accepted' && 
      r.reward && 
      !r.paymentProcessed
    ).length;
    
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    const thisMonth = acceptedReports
      .filter(r => new Date(r.updatedAt || r.submittedAt) >= thisMonthStart)
      .reduce((sum, r) => sum + r.reward, 0);
    
    const averagePayment = acceptedReports.length > 0 ? totalPaid / acceptedReports.length : 0;

    setStats({
      totalPaid,
      pendingPayments,
      thisMonth,
      averagePayment
    });
  };

  if (!isCompany()) {
    return <Navigate to="/company-login" />;
  }

  const markAsPaid = (reportId) => {
    const reports = JSON.parse(localStorage.getItem('reports') || '[]');
    const reportIndex = reports.findIndex(r => r.id === reportId);
    
    if (reportIndex !== -1) {
      reports[reportIndex].paymentProcessed = true;
      reports[reportIndex].paymentDate = new Date().toISOString();
      localStorage.setItem('reports', JSON.stringify(reports));
      loadPayments(); // Reload data
      alert('Payment marked as processed!');
    }
  };

  const getStatusColor = (report) => {
    if (report.paymentProcessed) return 'status-accepted';
    return 'status-pending';
  };

  return (
    <div className="company-payments-page">
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
            <Link to="/company-reports" className="sidebar-item">
              <span className="sidebar-icon">📋</span>
              <span className="sidebar-label">Reports</span>
            </Link>
            <div className="sidebar-item active">
              <span className="sidebar-icon">💰</span>
              <span className="sidebar-label">Payments</span>
            </div>
          </div>
        </aside>
        
        <main className="dashboard-main">
          <div className="payments-container">
            <div className="dashboard-header">
              <div>
                <h1 className="dashboard-title">Bounty Payments</h1>
                <p className="dashboard-subtitle">Manage payments to security researchers</p>
              </div>
              <button className="btn btn-primary" onClick={() => alert('Payment settings coming soon!')}>
                ⚙️ Payment Settings
              </button>
            </div>

            {/* Payment Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-value">${stats.totalPaid.toLocaleString()}</div>
                  <div className="stat-label">Total Paid</div>
                </div>
              </div>

              <div className="stat-card urgent">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.pendingPayments}</div>
                  <div className="stat-label">Pending Payments</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <div className="stat-value">${stats.thisMonth.toLocaleString()}</div>
                  <div className="stat-label">This Month</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <div className="stat-value">${Math.round(stats.averagePayment).toLocaleString()}</div>
                  <div className="stat-label">Average Payment</div>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="payments-section">
              <h2 className="section-title">Payment History</h2>

              {payments.length > 0 ? (
                <div className="payments-table">
                  <div className="table-header">
                    <div className="table-cell">Report</div>
                    <div className="table-cell">Researcher</div>
                    <div className="table-cell">Severity</div>
                    <div className="table-cell">Amount</div>
                    <div className="table-cell">Date</div>
                    <div className="table-cell">Status</div>
                    <div className="table-cell">Actions</div>
                  </div>
                  
                  {payments.map(payment => (
                    <div key={payment.id} className="table-row">
                      <div className="table-cell">
                        <div className="report-info">
                          <div className="report-title">{payment.title}</div>
                          <div className="report-type">{payment.vulnerabilityType}</div>
                        </div>
                      </div>
                      <div className="table-cell">
                        <div className="researcher-info">
                          <div className="researcher-avatar">{payment.username?.[0]?.toUpperCase()}</div>
                          <span className="researcher-name">@{payment.username}</span>
                        </div>
                      </div>
                      <div className="table-cell">
                        <span className={`severity-badge ${getSeverityColor(payment.severity)}`}>
                          {payment.severity}
                        </span>
                      </div>
                      <div className="table-cell">
                        <span className="payment-amount">${payment.reward.toLocaleString()}</span>
                      </div>
                      <div className="table-cell">
                        {new Date(payment.updatedAt || payment.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="table-cell">
                        <span className={`status-badge ${getStatusColor(payment)}`}>
                          {payment.paymentProcessed ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      <div className="table-cell">
                        {!payment.paymentProcessed ? (
                          <button 
                            onClick={() => markAsPaid(payment.id)}
                            className="btn btn-sm btn-success"
                          >
                            Mark as Paid
                          </button>
                        ) : (
                          <span className="payment-confirmed">✅ Paid</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-payments">
                  <div className="no-payments-icon">💰</div>
                  <h3>No Payments Yet</h3>
                  <p>Accepted vulnerability reports with bounties will appear here.</p>
                  <Link to="/company-reports" className="btn btn-primary btn-large">
                    View Reports →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyPayments;
