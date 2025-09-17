import React, { useState, useEffect } from 'react';
import { getNotificationsOfMentor, updateNotificationStatus } from '../../../services/api';
import '../../../styles/mentor_dashboard/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotificationsOfMentor();
      setNotifications(response.notifications);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications');
      setLoading(false);
    }
  };

  const handleAction = async (notificationId, action) => {
    try {
      await updateNotificationStatus(notificationId, action);
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (err) {
      console.error('Error updating notification:', err);
      alert('Failed to update notification. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="notifications-container">
      <h1 className="page-title">Your Notifications</h1>
      {notifications.length === 0 ? (
        <p className="no-notifications">No active notifications</p>
      ) : (
        <div className="notification-list">
          {notifications.map((notification, index) => (
            <div key={notification._id} className="notification-card">
              <div className="notification-number">{index + 1}</div>
              <div className="notification-content">
                <h3 className="notification-title">New Connection Request</h3>
                <p className="notification-message">{notification.message}</p>
                <p className="notification-from">From: {notification.mentee.name}</p>
              </div>
              <div className="notification-actions">
                <button 
                  className="action-btn accept"
                  onClick={() => handleAction(notification._id, 'accepted')}
                >
                  Accept
                </button>
                <button 
                  className="action-btn reject"
                  onClick={() => handleAction(notification._id, 'rejected')}
                >
                  Reject
                </button>
                <button 
                  className="action-btn dismiss"
                  onClick={() => handleAction(notification._id, 'dismissed')}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;