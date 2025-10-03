import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import { isAuthenticated, getCurrentUser, logout, deleteUserAccount } from '../utils/auth';
import { clearUserReports } from '../utils/reports';

const Settings = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState('account');
  const [message, setMessage] = useState('');

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setMessage('Deleting account...');
      const result = await deleteUserAccount(currentUser.id);
      
      if (result.success) {
        alert('Account deleted successfully');
        navigate('/');
      } else {
        setMessage('❌ ' + result.message);
      }
    }
  };

  const handleClearReports = async () => {
    if (window.confirm('Are you sure you want to clear all your reports?')) {
      setMessage('Clearing reports...');
      const result = await clearUserReports(currentUser.id);
      
      if (result.success) {
        setMessage('✅ All reports cleared successfully');
        setTimeout(() => {
          setMessage('');
          window.location.reload();
        }, 2000);
      } else {
        setMessage('❌ ' + result.message);
      }
    }
  };

  return (
    <div className="settings-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className="dashboard-main">
          <div className="settings-container">
            <div className="settings-header">
              <h1 className="dashboard-title">Settings</h1>
              <p className="dashboard-subtitle">Manage your account preferences</p>
            </div>

            {message && (
              <div className={`form-message ${message.includes('✅') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <div className="settings-layout">
              {/* Settings Tabs */}
              <div className="settings-tabs">
                <button
                  className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account')}
                >
                  <span className="tab-icon">👤</span>
                  Account
                </button>
                <button
                  className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <span className="tab-icon">🔔</span>
                  Notifications
                </button>
                <button
                  className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <span className="tab-icon">🔒</span>
                  Security
                </button>
                <button
                  className={`settings-tab ${activeTab === 'data' ? 'active' : ''}`}
                  onClick={() => setActiveTab('data')}
                >
                  <span className="tab-icon">📊</span>
                  Data & Privacy
                </button>
              </div>

              {/* Settings Content */}
              <div className="settings-content">
                {activeTab === 'account' && (
                  <div className="settings-section">
                    <h2 className="section-heading">Account Information</h2>
                    
                    <div className="settings-info-group">
                      <div className="info-item">
                        <span className="info-label">Username</span>
                        <span className="info-value">@{currentUser.username}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Email</span>
                        <span className="info-value">{currentUser.email}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Full Name</span>
                        <span className="info-value">{currentUser.fullName || 'Not set'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Member Since</span>
                        <span className="info-value">
                          {new Date(currentUser.joinedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="settings-actions">
                      <button className="btn btn-secondary" onClick={() => navigate('/profile')}>
                        Edit Profile →
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="settings-section">
                    <h2 className="section-heading">Notification Preferences</h2>
                    
                    <div className="settings-toggle-group">
                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Email Notifications</strong>
                          <p>Receive email updates about your reports</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Report Status Updates</strong>
                          <p>Get notified when your report status changes</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>New Program Alerts</strong>
                          <p>Be alerted when new companies join the platform</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-info">
                          <strong>Weekly Digest</strong>
                          <p>Receive weekly summary of platform activity</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="settings-section">
                    <h2 className="section-heading">Security Settings</h2>
                    
                    <div className="settings-info-group">
                      <div className="info-item">
                        <span className="info-label">Password</span>
                        <span className="info-value">••••••••</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Two-Factor Authentication</span>
                        <span className="info-value">
                          <span className="status-badge status-pending">Not Enabled</span>
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Active Sessions</span>
                        <span className="info-value">1 device</span>
                      </div>
                    </div>

                    <div className="settings-actions">
                      <button className="btn btn-secondary">
                        Change Password
                      </button>
                      <button className="btn btn-secondary">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'data' && (
                  <div className="settings-section">
                    <h2 className="section-heading">Data & Privacy</h2>
                    
                    <div className="settings-info-group">
                      <div className="info-item">
                        <span className="info-label">Total Reports</span>
                        <span className="info-value">{currentUser.reportsSubmitted || 0}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Total Earnings</span>
                        <span className="info-value">${(currentUser.totalEarnings || 0).toLocaleString()}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Account Status</span>
                        <span className="info-value">
                          <span className="status-badge status-accepted">Active</span>
                        </span>
                      </div>
                    </div>

                    <div className="danger-zone">
                      <h3 className="danger-heading">Danger Zone</h3>
                      <p className="danger-text">
                        These actions are irreversible. Please proceed with caution.
                      </p>
                      
                      <div className="danger-actions">
                        <button className="btn btn-danger" onClick={handleClearReports}>
                          Clear All Reports
                        </button>
                        <button className="btn btn-danger" onClick={handleDeleteAccount}>
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;

