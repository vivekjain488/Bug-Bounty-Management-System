import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import CompanyCard from '../shared/CompanyCard';
import { isAuthenticated } from '../utils/auth';
import { getAllCompanies } from '../utils/mockData';
import { getAllPrograms } from '../utils/programs';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [sortBy, setSortBy] = useState('bounty');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllPrograms = async () => {
      try {
        setLoading(true);
        // Get mock companies
        const mockCompanies = getAllCompanies();
        
        // Get MongoDB programs
        const dbPrograms = await getAllPrograms();
        console.log('📊 Companies Page: Loaded programs from DB:', dbPrograms);
        
        // Transform MongoDB programs
        const transformedPrograms = dbPrograms.map(prog => ({
          id: prog._id || prog.id,
          name: prog.name,
          logo: prog.logo || '🏢',
          industry: prog.industry,
          tags: prog.tags || [],
          severity: prog.severity || 'Medium',
          minBounty: prog.minBounty || 0,
          maxBounty: prog.maxBounty || 0,
          description: prog.description,
          about: prog.about,
          scope: prog.scope || [],
          outOfScope: prog.outOfScope || [],
          rules: prog.rules || [],
          rewardStructure: prog.rewardStructure || {}
        }));
        
        // Combine both
        const allPrograms = [...mockCompanies, ...transformedPrograms];
        setCompanies(allPrograms);
      } catch (error) {
        console.error('Error loading programs:', error);
        setCompanies(getAllCompanies());
      } finally {
        setLoading(false);
      }
    };
    
    loadAllPrograms();
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const handleSort = (criteria) => {
    setSortBy(criteria);
    let sorted = [...companies]; // Use current companies state instead
    
    // Ensure sorted is an array
    if (!Array.isArray(sorted)) {
      console.error('Companies is not an array:', sorted);
      sorted = [];
    }
    
    switch (criteria) {
      case 'bounty':
        sorted.sort((a, b) => (b.maxBounty || 0) - (a.maxBounty || 0));
        break;
      case 'name':
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'industry':
        sorted.sort((a, b) => (a.industry || '').localeCompare(b.industry || ''));
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
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2>Loading programs...</h2>
              <p>Fetching from database</p>
            </div>
          ) : (
            <div className="companies-grid">
              {companies.map(company => (
                <CompanyCard key={company.id || company._id} company={company} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Companies;

