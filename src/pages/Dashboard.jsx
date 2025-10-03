import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import CompanyCard from '../shared/CompanyCard';
import { isAuthenticated } from '../utils/auth';
import { getAllCompanies } from '../utils/mockData';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    severity: 'all',
    minBounty: '',
    maxBounty: '',
    tags: [],
  });

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const allCompanies = getAllCompanies();

  // Combined filter function that applies all filters
  const getFilteredCompanies = () => {
    let filtered = allCompanies;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query) ||
        company.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply severity filter
    if (filters.severity !== 'all') {
      filtered = filtered.filter(company =>
        company.severity.toLowerCase() === filters.severity.toLowerCase()
      );
    }

    // Apply bounty range filter
    if (filters.minBounty || filters.maxBounty) {
      filtered = filtered.filter(company => {
        const userMinBounty = filters.minBounty ? Number(filters.minBounty) : 0;
        const userMaxBounty = filters.maxBounty ? Number(filters.maxBounty) : Infinity;
        
        // Check if company's bounty range fits within user's specified range
        const meetsMinRequirement = !filters.minBounty || company.maxBounty >= userMinBounty;
        const meetsMaxRequirement = !filters.maxBounty || company.maxBounty <= userMaxBounty;
        
        return meetsMinRequirement && meetsMaxRequirement;
      });
    }

    return filtered;
  };

  const companies = getFilteredCompanies();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSeverityFilter = (severity) => {
    setFilters({ ...filters, severity });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      severity: 'all',
      minBounty: '',
      maxBounty: '',
      tags: [],
    });
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
                  placeholder="Min ($)"
                  value={filters.minBounty}
                  onChange={(e) => setFilters({ ...filters, minBounty: e.target.value })}
                  className="filter-input"
                  min="0"
                />
                <span className="filter-separator">-</span>
                <input
                  type="number"
                  placeholder="Max ($)"
                  value={filters.maxBounty}
                  onChange={(e) => setFilters({ ...filters, maxBounty: e.target.value })}
                  className="filter-input"
                  min="0"
                />
                <button onClick={clearFilters} className="btn btn-secondary btn-sm">
                  Clear All
                </button>
              </div>
            </div>
          </div>
          
          <div className="dashboard-results">
            <div className="results-info">
              <span className="results-count">
                {companies.length} of {allCompanies.length} programs
              </span>
              {(searchQuery || filters.severity !== 'all' || filters.minBounty || filters.maxBounty) && (
                <span className="active-filters">
                  (Filtered{searchQuery && ' by search'}{filters.severity !== 'all' && ` by ${filters.severity} severity`}{(filters.minBounty || filters.maxBounty) && ' by bounty range'})
                </span>
              )}
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

