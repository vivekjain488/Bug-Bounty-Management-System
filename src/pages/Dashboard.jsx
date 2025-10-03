import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import CompanyCard from '../shared/CompanyCard';
import { isAuthenticated } from '../utils/auth';
import { getAllCompanies } from '../utils/mockData';

const Dashboard = () => {
  const [companies, setCompanies] = useState(getAllCompanies());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    severity: 'all',
    minBounty: 0,
    maxBounty: 100000,
    tags: [],
  });

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const allCompanies = getAllCompanies();

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query === '') {
      setCompanies(allCompanies);
    } else {
      const filtered = allCompanies.filter(company =>
        company.name.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query) ||
        company.tags.some(tag => tag.toLowerCase().includes(query))
      );
      setCompanies(filtered);
    }
  };

  const handleSeverityFilter = (severity) => {
    setFilters({ ...filters, severity });
    
    if (severity === 'all') {
      setCompanies(allCompanies);
    } else {
      const filtered = allCompanies.filter(company =>
        company.severity.toLowerCase() === severity.toLowerCase()
      );
      setCompanies(filtered);
    }
  };

  const handleBountyFilter = () => {
    const filtered = allCompanies.filter(company =>
      company.maxBounty >= filters.minBounty && company.minBounty <= filters.maxBounty
    );
    setCompanies(filtered);
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Explore Programs</h1>
            <p className="dashboard-subtitle">Find bug bounty programs and start hunting</p>
          </div>
          
          <div className="dashboard-controls">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search companies, technologies, or industries..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            
            <div className="filter-bar">
              <div className="filter-group">
                <label className="filter-label">Severity:</label>
                <div className="filter-buttons">
                  <button
                    className={`filter-btn ${filters.severity === 'all' ? 'active' : ''}`}
                    onClick={() => handleSeverityFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`filter-btn ${filters.severity === 'critical' ? 'active' : ''}`}
                    onClick={() => handleSeverityFilter('critical')}
                  >
                    Critical
                  </button>
                  <button
                    className={`filter-btn ${filters.severity === 'high' ? 'active' : ''}`}
                    onClick={() => handleSeverityFilter('high')}
                  >
                    High
                  </button>
                  <button
                    className={`filter-btn ${filters.severity === 'medium' ? 'active' : ''}`}
                    onClick={() => handleSeverityFilter('medium')}
                  >
                    Medium
                  </button>
                </div>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Bounty Range:</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minBounty || ''}
                  onChange={(e) => setFilters({ ...filters, minBounty: Number(e.target.value) })}
                  className="filter-input"
                />
                <span className="filter-separator">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxBounty === 100000 ? '' : filters.maxBounty}
                  onChange={(e) => setFilters({ ...filters, maxBounty: Number(e.target.value) || 100000 })}
                  className="filter-input"
                />
                <button onClick={handleBountyFilter} className="btn btn-secondary btn-sm">
                  Apply
                </button>
              </div>
            </div>
          </div>
          
          <div className="companies-grid">
            {companies.length > 0 ? (
              companies.map(company => (
                <CompanyCard key={company.id} company={company} />
              ))
            ) : (
              <div className="no-results">
                <h3>No companies found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

