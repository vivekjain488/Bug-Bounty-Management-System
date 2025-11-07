import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { getAllPrograms } from '../utils/programs';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    const allPrograms = await getAllPrograms();
    if (Array.isArray(allPrograms)) {
      setPrograms(allPrograms);
    }
    setLoading(false);
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          program.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || program.industry === filter;
    return matchesSearch && matchesFilter;
  });

  const industries = ['all', ...new Set(programs.map(p => p.industry).filter(Boolean))];

  return (
    <div className="programs-page">
      <Navbar />
      
      <div className="programs-hero">
        <div className="hero-content">
          <h1 className="hero-title">Bug Bounty Programs</h1>
          <p className="hero-subtitle">
            Discover active bug bounty programs from leading companies worldwide
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">{programs.length}+</span>
              <span className="stat-label">Active Programs</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">$2.5M+</span>
              <span className="stat-label">Paid in Bounties</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Researchers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="programs-container">
        {/* Search and Filters */}
        <div className="programs-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-chips">
            {industries.map(industry => (
              <button
                key={industry}
                onClick={() => setFilter(industry)}
                className={`filter-chip ${filter === industry ? 'active' : ''}`}
              >
                {industry === 'all' ? 'All Programs' : industry}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading programs...</p>
          </div>
        ) : filteredPrograms.length > 0 ? (
          <div className="programs-grid">
            {filteredPrograms.map((program) => (
              <Link
                key={program._id || program.id}
                to={`/program/${program._id || program.id}`}
                className="program-card"
              >
                <div className="program-header">
                  <div className="program-logo">{program.logo || '🏢'}</div>
                  <div className="program-info">
                    <h3 className="program-name">{program.name}</h3>
                    <p className="program-industry">{program.industry}</p>
                  </div>
                  <span className="status-badge status-accepted">Active</span>
                </div>

                <p className="program-description">
                  {program.description?.substring(0, 150) || 'Security research program'}...
                </p>

                <div className="program-rewards">
                  <h4>Reward Range</h4>
                  <div className="reward-range">
                    <span className="reward-min">Min: ${program.minReward || 100}</span>
                    <span className="reward-separator">→</span>
                    <span className="reward-max">Max: ${program.maxReward || 10000}</span>
                  </div>
                </div>

                <div className="program-stats">
                  <div className="program-stat">
                    <span className="stat-icon">🐛</span>
                    <span>{program.reportsCount || 0} Reports</span>
                  </div>
                  <div className="program-stat">
                    <span className="stat-icon">💰</span>
                    <span>${(program.totalPaid || 0).toLocaleString()} Paid</span>
                  </div>
                </div>

                <div className="program-footer">
                  <button className="btn btn-primary btn-sm">
                    View Program →
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-programs">
            <div className="no-programs-icon">🔍</div>
            <h3>No programs found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Programs;
