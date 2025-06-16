import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user's role is not allowed, redirect to dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect to the appropriate dashboard based on user role
    switch (currentUser.role) {
      case 'student':
        return <Navigate to="/student/dashboard" replace />;
      case 'organization':
        return <Navigate to="/organization/dashboard" replace />;
      case 'university':
        return <Navigate to="/university/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // If everything is okay, render the children
  return children;
};

export default ProtectedRoute;