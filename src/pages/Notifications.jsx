import { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { isAuthenticated, getCurrentUser } from '../utils/auth';
import { Navigate } from 'react-router-dom';

const Notifications = () => {
  const currentUser = getCurrentUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications from localStorage or mock data for now
    const all = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(all.filter(n => n.userId === currentUser?.id || !n.userId));
  }, [currentUser]);

  if (!isAuthenticated()) return <Navigate to="/login" />;

  const markRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  return (
    <div className="notifications-page">
      <Navbar />
      <main className="content">
        <div className="notifications-container">
          <div className="notifications-header">
            <h1>Notifications</h1>
            <div>
              <button className="btn btn-secondary" onClick={markAllRead}>Mark all read</button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="no-notifications">
              <p>No notifications</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(n => (
                <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                  <div className="notification-body">
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                    <small>{new Date(n.date).toLocaleString()}</small>
                  </div>
                  {!n.read && <button className="btn btn-sm" onClick={() => markRead(n.id)}>Mark read</button>}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
