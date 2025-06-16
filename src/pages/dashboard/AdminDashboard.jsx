import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaBuilding, 
  FaUniversity, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaChartLine,
  FaUserGraduate,
  FaHandshake,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from '../../components/dashboard/StatCard';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalOrganizations: 0,
    totalUniversities: 0,
    totalInternships: 0,
    totalApplications: 0,
    totalEvents: 0,
    pendingApplications: 0,
    activeInternships: 0,
    recentRegistrations: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls - In real app, these would be actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      setStats({
        totalUsers: 0,
        totalStudents: 0,
        totalOrganizations: 0,
        totalUniversities: 0,
        totalInternships: 0,
        totalApplications: 0,
        totalEvents: 0,
        pendingApplications: 0,
        activeInternships: 0,
        recentRegistrations: 0
      });

      setRecentActivity([]);
      setSystemAlerts([
        {
          id: 1,
          type: 'info',
          title: 'System Ready',
          message: 'Island Scholars platform is ready for users to register and start using.',
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <FaExclamationTriangle className="w-5 h-5 text-red-500" />;
      case 'success':
        return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <FaCheckCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser.name}</p>
          <p className="text-sm text-gray-500">Manage the entire Island Scholars platform</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/admin/settings" className="btn-secondary">
            <FaEdit className="mr-2" />
            Settings
          </Link>
          <Link to="/admin/users" className="btn-primary">
            <FaUsers className="mr-2" />
            Manage Users
          </Link>
        </div>
      </div>

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">System Alerts</h2>
          {systemAlerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${getAlertBgColor(alert.type)}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-gray-800">{alert.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<FaUsers className="h-6 w-6" />}
          color="primary"
          subtitle="All registered users"
        />
        <StatCard 
          title="Organizations" 
          value={stats.totalOrganizations} 
          icon={<FaBuilding className="h-6 w-6" />}
          color="secondary"
          subtitle="Registered companies"
        />
        <StatCard 
          title="Universities" 
          value={stats.totalUniversities} 
          icon={<FaUniversity className="h-6 w-6" />}
          color="accent"
          subtitle="Partner institutions"
        />
        <StatCard 
          title="Students" 
          value={stats.totalStudents} 
          icon={<FaUserGraduate className="h-6 w-6" />}
          color="success"
          subtitle="Active students"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Internships" 
          value={stats.totalInternships} 
          icon={<FaFileAlt className="h-6 w-6" />}
          color="primary"
          subtitle={`${stats.activeInternships} active`}
        />
        <StatCard 
          title="Applications" 
          value={stats.totalApplications} 
          icon={<FaHandshake className="h-6 w-6" />}
          color="secondary"
          subtitle={`${stats.pendingApplications} pending`}
        />
        <StatCard 
          title="Events" 
          value={stats.totalEvents} 
          icon={<FaCalendarAlt className="h-6 w-6" />}
          color="accent"
          subtitle="Total events created"
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
            
            <div className="space-y-3">
              <Link
                to="/admin/users"
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center">
                  <FaUsers className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <span className="font-medium text-gray-800">Manage Users</span>
                    <p className="text-sm text-gray-600">View and manage all users</p>
                  </div>
                </div>
              </Link>
              
              <Link
                to="/admin/organizations"
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-secondary-300 hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center">
                  <FaBuilding className="w-5 h-5 text-secondary-600 mr-3" />
                  <div>
                    <span className="font-medium text-gray-800">Organizations</span>
                    <p className="text-sm text-gray-600">Manage organizations</p>
                  </div>
                </div>
              </Link>
              
              <Link
                to="/admin/internships"
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-accent-300 hover:bg-accent-50 transition-colors"
              >
                <div className="flex items-center">
                  <FaFileAlt className="w-5 h-5 text-accent-600 mr-3" />
                  <div>
                    <span className="font-medium text-gray-800">Internships</span>
                    <p className="text-sm text-gray-600">Monitor internship posts</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/applications"
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center">
                  <FaHandshake className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <span className="font-medium text-gray-800">Applications</span>
                    <p className="text-sm text-gray-600">Track applications</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/events"
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center">
                  <FaCalendarAlt className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <span className="font-medium text-gray-800">Events</span>
                    <p className="text-sm text-gray-600">Manage platform events</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/universities"
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center">
                  <FaUniversity className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <span className="font-medium text-gray-800">Universities</span>
                    <p className="text-sm text-gray-600">Partner universities</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
              <Link to="/admin/users" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map(activity => (
                  <motion.div 
                    key={activity.id}
                    whileHover={{ x: 5 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {activity.type === 'user_registration' && <FaUsers className="w-5 h-5 text-green-500" />}
                          {activity.type === 'internship_posted' && <FaFileAlt className="w-5 h-5 text-blue-500" />}
                          {activity.type === 'application_submitted' && <FaHandshake className="w-5 h-5 text-purple-500" />}
                          {activity.type === 'event_created' && <FaCalendarAlt className="w-5 h-5 text-orange-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaChartLine className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Activity will appear here as users interact with the platform
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaUsers className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-800">User Management</h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete control over all user accounts, roles, and permissions
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaChartLine className="w-8 h-8 text-secondary-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Analytics & Reports</h3>
            <p className="text-sm text-gray-600 mt-1">
              Monitor platform performance and generate detailed reports
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaEdit className="w-8 h-8 text-accent-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Content Management</h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage all platform content, internships, events, and applications
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;