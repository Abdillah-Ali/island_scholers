import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaUserCircle, FaBars, FaTimes, FaCog } from 'react-icons/fa';
import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';
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
    <Navbar expand="lg" className="navbar sticky-top shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <Logo showText={true} variant="default" />
        </Navbar.Brand>
        
        {/* Desktop navigation */}
        <Nav className="d-none d-lg-flex mx-auto">
          {navLinks.map((link) => (
            <Nav.Link
              key={link.to}
              as={NavLink}
              to={link.to}
              className="nav-link mx-2 px-3 py-2 rounded fw-medium"
              style={({ isActive }) => ({
                color: isActive ? 'var(--island-blue)' : 'var(--bs-gray-700)',
                backgroundColor: isActive ? 'rgba(0, 102, 204, 0.1)' : 'transparent'
              })}
            >
              {link.label}
            </Nav.Link>
          ))}
        </Nav>
        
        {/* User actions */}
        <div className="d-flex align-items-center">
          {isAuthenticated ? (
            <>
              {/* Admin Settings - Only show for admin */}
              {currentUser.role === 'admin' && (
                <Link
                  to="/admin/settings"
                  className="btn btn-link text-decoration-none p-2 me-2"
                >
                  <FaCog className="fs-5" />
                </Link>
              )}

              {/* Notifications */}
              <Dropdown show={notificationDropdownOpen} onToggle={toggleNotificationDropdown}>
                <Dropdown.Toggle
                  variant="link"
                  className="btn btn-link text-decoration-none p-2 me-2 position-relative"
                  onClick={toggleNotificationDropdown}
                >
                  <FaBell className="fs-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      bg="danger" 
                      className="position-absolute top-0 start-100 translate-middle rounded-pill"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Dropdown.Toggle>
                
                <AnimatePresence>
                  {notificationDropdownOpen && (
                    <NotificationDropdown onClose={() => setNotificationDropdownOpen(false)} />
                  )}
                </AnimatePresence>
              </Dropdown>
              
              {/* User menu */}
              <Dropdown show={userDropdownOpen} onToggle={toggleUserDropdown}>
                <Dropdown.Toggle
                  variant="link"
                  className="btn btn-link text-decoration-none d-flex align-items-center p-2"
                  onClick={toggleUserDropdown}
                >
                  {currentUser.profileImage ? (
                    <img 
                      src={currentUser.profileImage} 
                      alt={currentUser.name}
                      className="rounded-circle me-2"
                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                  ) : (
                    <FaUserCircle className="fs-4 me-2" />
                  )}
                  <span className="d-none d-lg-block text-dark">{currentUser.name}</span>
                </Dropdown.Toggle>
                
                <AnimatePresence>
                  {userDropdownOpen && (
                    <UserDropdown 
                      user={currentUser} 
                      onLogout={handleLogout} 
                      onClose={() => setUserDropdownOpen(false)} 
                    />
                  )}
                </AnimatePresence>
              </Dropdown>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2">
              {/* Show Sign Up button on login page */}
              {isLoginPage && (
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              )}
              
              {/* Show Log In button on register page */}
              {isRegisterPage && (
                <Link to="/login" className="btn btn-primary">
                  Log In
                </Link>
              )}
              
              {/* Show both buttons on other pages */}
              {!isLoginPage && !isRegisterPage && (
                <>
                  <Link to="/login" className="btn btn-outline-primary">
                    Log In
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
          
          {/* Mobile menu button */}
          <button
            className="btn btn-link d-lg-none p-2 ms-2"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <FaTimes className="fs-5" /> : <FaBars className="fs-5" />}
          </button>
        </div>
      </Container>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="d-lg-none bg-white border-top"
          >
            <Container>
              <Nav className="flex-column py-3">
                {navLinks.map((link) => (
                  <Nav.Link
                    key={link.to}
                    as={NavLink}
                    to={link.to}
                    className="nav-link py-2 px-3 rounded my-1"
                    onClick={() => setMobileMenuOpen(false)}
                    style={({ isActive }) => ({
                      color: isActive ? 'var(--island-blue)' : 'var(--bs-gray-700)',
                      backgroundColor: isActive ? 'rgba(0, 102, 204, 0.1)' : 'transparent'
                    })}
                  >
                    {link.label}
                  </Nav.Link>
                ))}
                
                {!isAuthenticated && (
                  <div className="d-flex flex-column gap-2 mt-3">
                    {/* Show Sign Up button on login page */}
                    {isLoginPage && (
                      <Link 
                        to="/register" 
                        className="btn btn-primary" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    )}
                    
                    {/* Show Log In button on register page */}
                    {isRegisterPage && (
                      <Link 
                        to="/login" 
                        className="btn btn-primary" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Log In
                      </Link>
                    )}
                    
                    {/* Show both buttons on other pages */}
                    {!isLoginPage && !isRegisterPage && (
                      <>
                        <Link 
                          to="/login" 
                          className="btn btn-outline-primary" 
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Log In
                        </Link>
                        <Link 
                          to="/register" 
                          className="btn btn-primary" 
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </Nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </Navbar>
  );
};

export default Header;