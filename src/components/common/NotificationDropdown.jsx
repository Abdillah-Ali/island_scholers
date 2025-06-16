import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBell, FaCheckCircle, FaEnvelope, FaExclamationCircle, FaFileAlt } from 'react-icons/fa';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application':
        return <FaFileAlt className="h-5 w-5 text-primary-500" />;
      case 'message':
        return <FaEnvelope className="h-5 w-5 text-accent-500" />;
      case 'alert':
        return <FaExclamationCircle className="h-5 w-5 text-warning" />;
      case 'success':
        return <FaCheckCircle className="h-5 w-5 text-success" />;
      case 'recommendation':
      default:
        return <FaBell className="h-5 w-5 text-secondary-500" />;
    }
  };

  // Format notification timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto border border-gray-200"
    >
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
          <button
            onClick={markAllAsRead}
            className="text-xs text-primary-500 hover:text-primary-700"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.read ? 'bg-primary-50' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0 ml-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary-500"></span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-gray-500">
            <p>No notifications yet</p>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-gray-200">
        <Link
          to="#"
          className="block text-center text-xs text-primary-500 hover:text-primary-700"
          onClick={onClose}
        >
          View all notifications
        </Link>
      </div>
    </motion.div>
  );
};

export default NotificationDropdown;