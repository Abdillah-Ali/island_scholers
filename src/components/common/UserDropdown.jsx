import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt, FaUserShield } from 'react-icons/fa';

const UserDropdown = ({ user, onLogout, onClose }) => {
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

  // Get profile and dashboard links based on user role
  const getLinks = () => {
    switch (user.role) {
      case 'student':
        return {
          profile: '/student/profile',
          dashboard: '/student/dashboard',
        };
      case 'organization':
        return {
          profile: '/organization/profile',
          dashboard: '/organization/dashboard',
        };
      case 'university':
        return {
          profile: '/university/profile',
          dashboard: '/university/dashboard',
        };
      case 'admin':
        return {
          profile: '/admin/settings',
          dashboard: '/admin/dashboard',
        };
      default:
        return {
          profile: '/',
          dashboard: '/',
        };
    }
  };

  const links = getLinks();

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg py-1 z-50 border border-gray-200"
    >
      <div className="px-4 py-3 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
        <p className="text-xs text-gray-600 truncate">{user.email}</p>
        <p className="text-xs text-primary-500 capitalize mt-1 flex items-center">
          {user.role === 'admin' && <FaUserShield className="mr-1" />}
          {user.role}
        </p>
      </div>

      <div className="py-1">
        {user.role !== 'admin' && (
          <Link
            to={links.profile}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <FaUser className="mr-3 w-4 h-4 text-gray-500" />
            <span>Your Profile</span>
          </Link>
        )}
        <Link
          to={links.dashboard}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          <FaCog className="mr-3 w-4 h-4 text-gray-500" />
          <span>{user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}</span>
        </Link>
        {user.role === 'admin' && (
          <Link
            to="/admin/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <FaUserShield className="mr-3 w-4 h-4 text-gray-500" />
            <span>Admin Settings</span>
          </Link>
        )}
      </div>

      <div className="py-1 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <FaSignOutAlt className="mr-3 w-4 h-4 text-gray-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
};

export default UserDropdown;