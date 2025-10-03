import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import { isAuthenticated, getCurrentUser, updateUserProfile } from '../utils/auth';

const Profile = () => {
  const currentUser = getCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    bio: currentUser?.bio || '',
    skills: currentUser?.skills?.join(', ') || '',
  });
  const [message, setMessage] = useState('');

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
    };
    
    setMessage('Updating profile...');
    const result = await updateUserProfile(updatedData);
    
    if (result.success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => {
        setMessage('');
        window.location.reload();
      }, 2000);
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className="dashboard-main">
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-avatar-large">
                {currentUser.username[0].toUpperCase()}
              </div>
              <div className="profile-header-info">
                <h1 className="profile-username">@{currentUser.username}</h1>
                <p className="profile-email">{currentUser.email}</p>
                <span className="profile-rank">{currentUser.rank}</span>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-secondary"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            {message && (
              <div className={`profile-message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
            
            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <div className="stat-value">{currentUser.reportsSubmitted}</div>
                  <div className="stat-label">Reports Submitted</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-value">${currentUser.totalEarnings.toLocaleString()}</div>
                  <div className="stat-label">Total Earnings</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <div className="stat-value">{currentUser.rank}</div>
                  <div className="stat-label">Current Rank</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <div className="stat-value">
                    {new Date(currentUser.joinedDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="stat-label">Member Since</div>
                </div>
              </div>
            </div>
            
            <div className="profile-details">
              <h2 className="section-heading">Profile Information</h2>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="form-textarea"
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Skills (comma-separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Web Security, XSS, SQLi, CSRF"
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="profile-info">
                  <div className="info-row">
                    <span className="info-label">Full Name:</span>
                    <span className="info-value">{currentUser.fullName || 'Not set'}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Bio:</span>
                    <span className="info-value">{currentUser.bio || 'No bio yet'}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Skills:</span>
                    <div className="skills-list">
                      {currentUser.skills && currentUser.skills.length > 0 ? (
                        currentUser.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))
                      ) : (
                        <span className="info-value">No skills added yet</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;

