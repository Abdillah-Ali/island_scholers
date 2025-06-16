import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaUserCircle, FaBars, FaTimes, FaCog } from 'react-icons/fa';
import NotificationDropdown from '../common/NotificationDropdown';
import UserDropdown from '../common/UserDropdown';
import Logo from '../common/Logo';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setUserDropdownOpen(false);
  };
  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
    setNotificationDropdownOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
  };

  // Check current page to determine which auth buttons to show
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  // Define navigation links based on user role
  const getNavLinks = () => {
    const commonLinks = [
      { to: '/organizations', label: 'Organizations' },
      { to: '/internships', label: 'Internships' },
    ];
    
    if (!isAuthenticated) {
      return commonLinks;
    }
    
    switch (currentUser.role) {
      case 'student':
        return [
          ...commonLinks,
          { to: '/student/dashboard', label: 'Dashboard' },
        ];
      case 'organization':
        return [
          ...commonLinks,
          { to: '/organization/dashboard', label: 'Dashboard' },
        ];
      case 'university':
        return [
          ...commonLinks,
          { to: '/university/dashboard', label: 'Dashboard' },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Admin Dashboard' },
          { to: '/admin/users', label: 'Users' },
          { to: '/admin/organizations', label: 'Organizations' },
          { to: '/admin/internships', label: 'Internships' },
        ];
      default:
        return commonLinks;
    }
  };

  const navLinks = getNavLinks();
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <Logo showText={true} variant="default" />
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => 
                  `text-base font-medium ${
                    isActive 
                      ? 'text-primary-600 border-b-2 border-primary-500' 
                      : 'text-gray-600 hover:text-primary-500'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          
          {/* User actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Admin Settings - Only show for admin */}
                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin/settings"
                    className="p-1 rounded-full text-gray-600 hover:text-primary-500 focus:outline-none"
                  >
                    <FaCog className="h-6 w-6" />
                  </Link>
                )}

                {/* Notifications */}
                <div className="relative">
                  <button
                    className="p-1 rounded-full text-gray-600 hover:text-primary-500 focus:outline-none"
                    onClick={toggleNotificationDropdown}
                  >
                    <FaBell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {notificationDropdownOpen && (
                      <NotificationDropdown onClose={() => setNotificationDropdownOpen(false)} />
                    )}
                  </AnimatePresence>
                </div>
                
                {/* User menu */}
                <div className="relative">
                  <button
                    className="flex items-center text-gray-600 hover:text-primary-500 focus:outline-none"
                    onClick={toggleUserDropdown}
                  >
                    {currentUser.profileImage ? (
                      <img 
                        src={currentUser.profileImage} 
                        alt={currentUser.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="h-8 w-8" />
                    )}
                    <span className="ml-2 hidden lg:block">{currentUser.name}</span>
                  </button>
                  
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <UserDropdown user={currentUser} onLogout={handleLogout} onClose={() => setUserDropdownOpen(false)} />
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Show Sign Up button on login page */}
                {isLoginPage && (
                  <>
                    <Link to="/register" className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-md font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
                      Sign Up
                    </Link>
                  </>
                )}
                
                {/* Show Log In button on register page */}
                {isRegisterPage && (
                  <>
                    <Link to="/login" className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-md font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
                      Log In
                    </Link>
                  </>
                )}
                
                {/* Show both buttons on other pages */}
                {!isLoginPage && !isRegisterPage && (
                  <>
                    <Link to="/login" className="border border-primary-500 text-primary-500 px-4 py-2 rounded-md font-medium hover:bg-primary-50 transition-all duration-200">
                      Log In
                    </Link>
                    <Link to="/register" className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-md font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-500 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <nav className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-600 hover:bg-neutral-100 hover:text-primary-500'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-4 flex flex-col space-y-2">
                  {/* Show Sign Up button on login page */}
                  {isLoginPage && (
                    <Link to="/register" className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-md font-medium text-center hover:from-primary-600 hover:to-secondary-600 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  )}
                  
                  {/* Show Log In button on register page */}
                  {isRegisterPage && (
                    <Link to="/login" className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-md font-medium text-center hover:from-primary-600 hover:to-secondary-600 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                      Log In
                    </Link>
                  )}
                  
                  {/* Show both buttons on other pages */}
                  {!isLoginPage && !isRegisterPage && (
                    <>
                      <Link to="/login" className="border border-primary-500 text-primary-500 px-4 py-2 rounded-md font-medium text-center hover:bg-primary-50 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                        Log In
                      </Link>
                      <Link to="/register" className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-md font-medium text-center hover:from-primary-600 hover:to-secondary-600 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;