import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { isAuthenticated, getCurrentUser } from '../utils/auth';
import { getAllPrograms } from '../utils/programs';
import { submitReport } from '../utils/reports';

const SubmitReport = () => {
  const currentUser = getCurrentUser();
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({
    programId: '',
    title: '',
    category: 'XSS',
    severity: 'Medium',
    description: '',
    stepsToReproduce: '',
    impact: '',
    targetUrl: '',
    proofOfConcept: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const all = await getAllPrograms();
      if (Array.isArray(all)) setPrograms(all);
    };
    load();
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.programId || !form.title || !form.description || !form.stepsToReproduce) {
      setMessage('Please fill required fields');
      return;
    }

    const reportData = {
      ...form,
      companyId: form.programId, // assume programId maps to a company for now
      submittedAt: new Date().toISOString()
    };

    setMessage('Submitting...');
    const res = await submitReport(reportData);
    if (res.success) {
      setMessage('✅ Report submitted successfully');
      setForm({ programId: '', title: '', category: 'XSS', severity: 'Medium', description: '', stepsToReproduce: '', impact: '', targetUrl: '', proofOfConcept: '' });
    } else {
      setMessage('❌ ' + res.message);
    }
  };

  return (
    <div className="submit-report-page">
      <Navbar />

      <main className="content">
        <div className="submit-container">
          <h1>Submit a Vulnerability Report</h1>

          {message && <div className={`form-message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}

          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <label>Program</label>
              <select name="programId" value={form.programId} onChange={handleChange} className="form-input">
                <option value="">Select a program</option>
                {programs.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="form-input">
                  <option value="XSS">XSS</option>
                  <option value="SQLi">SQL Injection</option>
                  <option value="CSRF">CSRF</option>
                  <option value="Auth">Authentication</option>
                </select>
              </div>

              <div className="form-group">
                <label>Severity</label>
                <select name="severity" value={form.severity} onChange={handleChange} className="form-input">
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="form-textarea" />
            </div>

            <div className="form-group">
              <label>Steps to Reproduce</label>
              <textarea name="stepsToReproduce" value={form.stepsToReproduce} onChange={handleChange} className="form-textarea" />
            </div>

            <div className="form-group">
              <label>Impact</label>
              <textarea name="impact" value={form.impact} onChange={handleChange} className="form-textarea" />
            </div>

            <button className="btn btn-primary" type="submit">Submit Report</button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitReport;
