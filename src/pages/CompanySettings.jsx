import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import { isCompany, getCurrentUser } from '../utils/auth';

const CompanySettings = () => {
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState('company');
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    // Company Info
    companyName: currentUser.companyName || '',
    industry: 'Technology',
    website: currentUser.website || '',
    description: '',
    
    // Program Settings
    autoAccept: false,
    requireVerification: true,
    publicListing: true,
    allowDuplicates: false,
    
    // Notifications
    newReportAlert: true,
    weeklyDigest: true,
    paymentReminders: true,
    
    // Billing
    paymentMethod: 'credit-card',
    autoPayAccepted: true,
  });

  if (!isCompany()) {
    return <Navigate to="/company-login" />;
  }

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleToggle = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleSave = () => {
    setMessage('✅ Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="company-settings-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className="dashboard-main">
          <div className="settings-container">
            <div className="settings-header">
              <h1 className="dashboard-title">Company Settings</h1>
              <p className="dashboard-subtitle">Manage your bug bounty program</p>
            </div>

            {message && (
              <div className="form-message success">{message}</div>
            )}

            <div className="settings-layout">
              <div className="settings-tabs">
                <button
                  className={`settings-tab ${activeTab === 'company' ? 'active' : ''}`}
                  onClick={() => setActiveTab('company')}
                >
                  <span className="tab-icon">🏢</span>
                  Company Info
                </button>
                <button
                  className={`settings-tab ${activeTab === 'program' ? 'active' : ''}`}
                  onClick={() => setActiveTab('program')}
                >
                  <span className="tab-icon">🎯</span>
                  Program
                </button>
                <button
                  className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <span className="tab-icon">🔔</span>
                  Notifications
                </button>
                <button
                  className={`settings-tab ${activeTab === 'billing' ? 'active' : ''}`}
                  onClick={() => setActiveTab('billing')}
                >
                  <span className="tab-icon">💳</span>
                  Billing
                </button>
              </div>

              <div className="settings-content">
                {activeTab === 'company' && (
                  <div className="settings-section">
                    <h2 className="section-heading">Company Information</h2>
                    
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        value={settings.companyName}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Your Company Inc."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Industry</label>
                      <select
                        name="industry"
                        value={settings.industry}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={settings.website}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="https://yourcompany.com"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Company Description</label>
                      <textarea
                        name="description"
                        value={settings.description}
                        onChange={handleChange}
                        className="form-textarea"
                        rows="4"
                        placeholder="Tell researchers about your company..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'program' && (
                  <div className="settings-section">
                    <h2 className="section-heading">Bug Bounty Program Settings</h2>
                    
                    <div className="settings-toggle-group">
                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Public Program Listing</strong>
                          <p>Make your program visible to all researchers</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.publicListing}
                            onChange={() => handleToggle('publicListing')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Require Researcher Verification</strong>
                          <p>Only accept reports from verified researchers</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.requireVerification}
                            onChange={() => handleToggle('requireVerification')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Auto-Accept Low Severity</strong>
                          <p>Automatically accept low severity reports</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.autoAccept}
                            onChange={() => handleToggle('autoAccept')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Allow Duplicate Reports</strong>
                          <p>Accept reports even if similar issue exists</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.allowDuplicates}
                            onChange={() => handleToggle('allowDuplicates')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="settings-section">
                    <h2 className="section-heading">Notification Preferences</h2>
                    
                    <div className="settings-toggle-group">
                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>New Report Alerts</strong>
                          <p>Email notification for each new report</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.newReportAlert}
                            onChange={() => handleToggle('newReportAlert')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Weekly Digest</strong>
                          <p>Weekly summary of all report activity</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.weeklyDigest}
                            onChange={() => handleToggle('weeklyDigest')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Payment Reminders</strong>
                          <p>Remind about pending bounty payments</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.paymentReminders}
                            onChange={() => handleToggle('paymentReminders')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="settings-section">
                    <h2 className="section-heading">Billing & Payments</h2>
                    
                    <div className="form-group">
                      <label className="form-label">Payment Method</label>
                      <select
                        name="paymentMethod"
                        value={settings.paymentMethod}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="credit-card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="crypto">Cryptocurrency</option>
                      </select>
                    </div>

                    <div className="settings-toggle-group">
                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Auto-Pay Accepted Reports</strong>
                          <p>Automatically pay bounties for accepted reports</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.autoPayAccepted}
                            onChange={() => handleToggle('autoPayAccepted')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="billing-info">
                      <h3 className="subsection-heading">Current Plan</h3>
                      <div className="plan-card">
                        <div className="plan-header">
                          <strong>Enterprise Plan</strong>
                          <span className="plan-price">$299/month</span>
                        </div>
                        <ul className="plan-features">
                          <li>✅ Unlimited reports</li>
                          <li>✅ Priority support</li>
                          <li>✅ Advanced analytics</li>
                          <li>✅ Custom integrations</li>
                        </ul>
                        <button className="btn btn-secondary">Change Plan</button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="settings-actions">
                  <button onClick={handleSave} className="btn btn-primary btn-large">
                    Save All Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanySettings;
