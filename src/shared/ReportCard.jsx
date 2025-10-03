const ReportCard = ({ report, company }) => {
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
    switch (severity.toLowerCase()) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'severity-info';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="report-card">
      <div className="report-header">
        <div className="report-company">
          <span className="company-logo-sm">{company?.logo || '🐛'}</span>
          <span className="company-name-sm">{company?.name || 'Unknown'}</span>
        </div>
        <span className={`status-badge ${getStatusColor(report.status)}`}>
          {report.status}
        </span>
      </div>
      
      <h3 className="report-title">{report.title}</h3>
      
      <div className="report-meta">
        <span className={`severity-badge ${getSeverityColor(report.severity)}`}>
          {report.severity}
        </span>
        <span className="report-type">{report.vulnerabilityType}</span>
      </div>
      
      <p className="report-description">{report.description.substring(0, 150)}...</p>
      
      <div className="report-footer">
        <div className="report-date">
          <span className="date-label">Submitted:</span>
          <span className="date-value">{formatDate(report.submittedAt)}</span>
        </div>
        {report.reward && (
          <div className="report-reward">
            <span className="reward-icon">💰</span>
            <span className="reward-amount">${report.reward.toLocaleString()}</span>
          </div>
        )}
      </div>
      
      {report.feedback && (
        <div className="report-feedback">
          <strong>Feedback:</strong> {report.feedback}
        </div>
      )}
    </div>
  );
};

export default ReportCard;

