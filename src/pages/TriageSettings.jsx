import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { isTriageTeam, getCurrentUser } from '../utils/auth';

const TriageSettings = () => {
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    // General
    autoAssign: true,
    prioritizeCritical: true,
    notifyNewReports: true,
    
    // Notifications
    emailDigest: 'daily',
    slackIntegration: false,
    criticalAlerts: true,
    weeklyReport: true,
    
    // Automation
    autoCloseStale: false,
    staleDays: 30,
    requireDuplicateCheck: true,
    autoTagging: true,
    
    // Team
    maxReviewsPerDay: 20,
    responseTimeGoal: 24, // hours
  });

  if (!isTriageTeam()) {
    return <Navigate to="/triage-login" />;
  }

  const handleToggle = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
    setMessage('Settings updated successfully!');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setMessage('✅ All settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="triage-settings-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <aside className="triage-sidebar">
          <div className="sidebar-menu">
            <Link to="/triage-dashboard" className="sidebar-item">
              <span className="sidebar-icon">🔍</span>
              <span className="sidebar-label">Review Queue</span>
            </Link>
            <Link to="/triage-analytics" className="sidebar-item">
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-label">Analytics</span>
            </Link>
            <div className="sidebar-item active">
              <span className="sidebar-icon">⚙️</span>
              <span className="sidebar-label">Settings</span>
            </div>
          </div>
        </aside>
        
        <main className="dashboard-main">
          <div className="settings-container">
            <div className="settings-header">
              <h1 className="dashboard-title">Triage Settings</h1>
              <p className="dashboard-subtitle">Configure platform behavior and preferences</p>
            </div>

            {message && (
              <div className={`form-message ${message.includes('✅') ? 'success' : 'info'}`}>
                {message}
              </div>
            )}

            <div className="settings-layout">
              {/* Settings Tabs */}
              <div className="settings-tabs">
                <button
                  className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
                  onClick={() => setActiveTab('general')}
                >
                  <span className="tab-icon">🎛️</span>
                  General
                </button>
                <button
                  className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <span className="tab-icon">🔔</span>
                  Notifications
                </button>
                <button
                  className={`settings-tab ${activeTab === 'automation' ? 'active' : ''}`}
                  onClick={() => setActiveTab('automation')}
                >
                  <span className="tab-icon">🤖</span>
                  Automation
                </button>
                <button
                  className={`settings-tab ${activeTab === 'team' ? 'active' : ''}`}
                  onClick={() => setActiveTab('team')}
                >
                  <span className="tab-icon">👥</span>
                  Team
                </button>
              </div>

              {/* Settings Content */}
              <div className="settings-content">
                {activeTab === 'general' && (
                  <div className="settings-section">
                    <h2 className="section-heading">General Settings</h2>
                    
                    <div className="settings-toggle-group">
                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Auto-Assign Reports</strong>
                          <p>Automatically assign new reports to available team members</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.autoAssign}
                            onChange={() => handleToggle('autoAssign')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Prioritize Critical Reports</strong>
                          <p>Show critical severity reports at the top of the queue</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.prioritizeCritical}
                            onChange={() => handleToggle('prioritizeCritical')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Notify on New Reports</strong>
                          <p>Receive instant notification when new report is submitted</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.notifyNewReports}
                            onChange={() => handleToggle('notifyNewReports')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="settings-info-group">
                      <div className="info-item">
                        <span className="info-label">Triage Team Member</span>
                        <span className="info-value">{currentUser.fullName || currentUser.username}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Email</span>
                        <span className="info-value">{currentUser.email}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Access Level</span>
                        <span className="info-value">
                          <span className="status-badge status-accepted">Admin</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="settings-section">
                    <h2 className="section-heading">Notification Preferences</h2>
                    
                    <div className="form-group">
                      <label className="form-label">Email Digest Frequency</label>
                      <select
                        name="emailDigest"
                        value={settings.emailDigest}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="instant">Instant</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="never">Never</option>
                      </select>
                    </div>

                    <div className="settings-toggle-group">
                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Slack Integration</strong>
                          <p>Send notifications to Slack workspace</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.slackIntegration}
                            onChange={() => handleToggle('slackIntegration')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Critical Severity Alerts</strong>
                          <p>Get immediate alerts for critical severity reports</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.criticalAlerts}
                            onChange={() => handleToggle('criticalAlerts')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Weekly Performance Report</strong>
                          <p>Receive weekly summary of team performance</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.weeklyReport}
                            onChange={() => handleToggle('weeklyReport')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'automation' && (
                  <div className="settings-section">
                    <h2 className="section-heading">Automation Rules</h2>
                    
                    <div className="settings-toggle-group">
                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Auto-Close Stale Reports</strong>
                          <p>Automatically close reports with no activity</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.autoCloseStale}
                            onChange={() => handleToggle('autoCloseStale')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      {settings.autoCloseStale && (
                        <div className="form-group">
                          <label className="form-label">Days Before Closing</label>
                          <input
                            type="number"
                            name="staleDays"
                            value={settings.staleDays}
                            onChange={handleChange}
                            className="form-input"
                            min="7"
                            max="90"
                          />
                        </div>
                      )}

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Require Duplicate Check</strong>
                          <p>Force triage team to check for duplicates before accepting</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.requireDuplicateCheck}
                            onChange={() => handleToggle('requireDuplicateCheck')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Auto-Tagging</strong>
                          <p>Automatically tag reports based on content analysis</p>
                        </div>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={settings.autoTagging}
                            onChange={() => handleToggle('autoTagging')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'team' && (
                  <div className="settings-section">
                    <h2 className="section-heading">Team Configuration</h2>
                    
                    <div className="form-group">
                      <label className="form-label">Max Reviews Per Day (Per Member)</label>
                      <input
                        type="number"
                        name="maxReviewsPerDay"
                        value={settings.maxReviewsPerDay}
                        onChange={handleChange}
                        className="form-input"
                        min="1"
                        max="100"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Response Time Goal (Hours)</label>
                      <input
                        type="number"
                        name="responseTimeGoal"
                        value={settings.responseTimeGoal}
                        onChange={handleChange}
                        className="form-input"
                        min="1"
                        max="168"
                      />
                    </div>

                    <div className="team-members-list">
                      <h3 className="subsection-heading">Team Members</h3>
                      <div className="member-item">
                        <div className="member-avatar">👤</div>
                        <div className="member-info">
                          <strong>{currentUser.fullName || currentUser.username}</strong>
                          <span className="member-role">Admin • {currentUser.email}</span>
                        </div>
                        <span className="status-badge status-accepted">Active</span>
                      </div>
                      <div className="member-item">
                        <div className="member-avatar">👤</div>
                        <div className="member-info">
                          <strong>Sarah Johnson</strong>
                          <span className="member-role">Reviewer • sarah@bugflow.com</span>
                        </div>
                        <span className="status-badge status-accepted">Active</span>
                      </div>
                      <div className="member-item">
                        <div className="member-avatar">👤</div>
                        <div className="member-info">
                          <strong>Mike Chen</strong>
                          <span className="member-role">Reviewer • mike@bugflow.com</span>
                        </div>
                        <span className="status-badge status-pending">Away</span>
                      </div>
                    </div>

                    <button className="btn btn-secondary">
                      + Invite Team Member
                    </button>
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

export default TriageSettings;
