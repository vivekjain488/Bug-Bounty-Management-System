import { Link } from 'react-router-dom';

const CompanyCard = ({ company }) => {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'severity-info';
    }
  };

  return (
    <div className="company-card">
      <div className="company-header">
        <div className="company-logo">{company.logo || company.name[0]}</div>
        <div className="company-info">
          <h3 className="company-name">{company.name}</h3>
          <p className="company-type">{company.industry}</p>
        </div>
      </div>
      
      <div className="company-tags">
        {company.tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>
      
      <div className="company-stats">
        <div className="stat">
          <span className="stat-label">Bounty Range</span>
          <span className="stat-value">${company.minBounty} - ${company.maxBounty}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Max Severity</span>
          <span className={`stat-badge ${getSeverityColor(company.severity)}`}>
            {company.severity}
          </span>
        </div>
      </div>
      
      <div className="company-description">
        <p>{company.description}</p>
      </div>
      
      <div className="company-actions">
        <Link to={`/company/${company.id}`} className="btn btn-primary btn-block">
          View Program & Report Bug →
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;

