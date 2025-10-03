import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import CompanyCard from '../shared/CompanyCard';
import { isAuthenticated } from '../utils/auth';
import { getAllCompanies } from '../utils/mockData';

const Companies = () => {
  const [companies, setCompanies] = useState(getAllCompanies());
  const [sortBy, setSortBy] = useState('bounty');

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const handleSort = (criteria) => {
    setSortBy(criteria);
    let sorted = [...getAllCompanies()];
    
    switch (criteria) {
      case 'bounty':
        sorted.sort((a, b) => b.maxBounty - a.maxBounty);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'industry':
        sorted.sort((a, b) => a.industry.localeCompare(b.industry));
        break;
      default:
        break;
    }
    
    setCompanies(sorted);
  };

  return (
    <div className="companies-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className="dashboard-main">
          <div className="companies-header">
            <div>
              <h1 className="dashboard-title">All Companies</h1>
              <p className="dashboard-subtitle">Browse all available bug bounty programs</p>
            </div>
            
            <div className="sort-controls">
              <label className="sort-label">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="sort-select"
              >
                <option value="bounty">Highest Bounty</option>
                <option value="name">Name</option>
                <option value="industry">Industry</option>
              </select>
            </div>
          </div>
          
          <div className="companies-count">
            <span className="count-badge">{companies.length} Programs Available</span>
          </div>
          
          <div className="companies-grid">
            {companies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Companies;

