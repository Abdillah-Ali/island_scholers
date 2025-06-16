import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { mockNotifications } from '../data/mockData';

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      // Filter notifications for current user based on role and user ID
      const userNotifications = mockNotifications.filter(notification => {
        return notification.userRole === currentUser.role && 
              (!notification.userId || notification.userId === currentUser.id);
      });
      
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.read).length);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser]);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    
    setUnreadCount(0);
  };

  // Add a new notification (for demo purposes)
  const addNotification = (notification) => {
    const newNotification = {
      id: `notification-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    return newNotification;
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};