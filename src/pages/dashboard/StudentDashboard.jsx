import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaFile, FaCheckCircle, FaClock, FaBuilding, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from '../../components/dashboard/StatCard';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendedInternships, setRecommendedInternships] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDirectApplicationModal, setShowDirectApplicationModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In a real app, these would be API calls to your Django backend
      // const [applicationsRes, internshipsRes, organizationsRes] = await Promise.all([
      //   fetch('/api/applications/my-applications/'),
      //   fetch('/api/internships/recommended/'),
      //   fetch('/api/organizations/')
      // ]);
      
      // For now, we'll use empty arrays since we removed sample data
      setApplications([]);
      setRecommendedInternships([]);
      setOrganizations([]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Count applications by status
  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const acceptedCount = applications.filter(app => app.status === 'accepted').length;
  const totalApplications = applications.length;

  const handleDirectApplication = (organization) => {
    setSelectedOrganization(organization);
    setShowDirectApplicationModal(true);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser.name}</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/internships" className="btn-primary">
            Find Internships
          </Link>
          <button 
            onClick={() => setShowDirectApplicationModal(true)}
            className="btn-secondary flex items-center"
          >
            <FaPaperPlane className="mr-2" />
            Direct Application
          </button>
          <Link to="/student/profile" className="btn-outline">
            View Profile
          </Link>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Applied Internships" 
          value={totalApplications} 
          icon={<FaFile className="h-6 w-6" />}
          color="primary"
        />
        <StatCard 
          title="Pending Applications" 
          value={pendingCount} 
          icon={<FaClock className="h-6 w-6" />}
          color="warning"
        />
        <StatCard 
          title="Accepted Applications" 
          value={acceptedCount} 
          icon={<FaCheckCircle className="h-6 w-6" />}
          color="success"
        />
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Applications</h2>
              <Link to="/student/applications" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            
            {applications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {applications.slice(0, 5).map(application => (
                  <div key={application.id} className="py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {application.internship_title || 'Direct Application'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Applied on {new Date(application.applied_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : application.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : application.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {application.organization_name}
                      </p>
                      {application.internship && (
                        <Link 
                          to={`/internships/${application.internship}`} 
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaFile className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by applying to internships
                </p>
                <div className="mt-6">
                  <Link to="/internships" className="btn-primary">
                    Find Internships
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Recommended Internships */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Recommended For You</h2>
            
            {recommendedInternships.length > 0 ? (
              <div className="space-y-4">
                {recommendedInternships.map(internship => (
                  <motion.div 
                    key={internship.id}
                    whileHover={{ x: 5 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50"
                  >
                    <h3 className="font-medium text-gray-800">{internship.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{internship.description?.substring(0, 80)}...</p>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {internship.skills_required?.slice(0, 2).map(skill => (
                          <span key={skill} className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                        {internship.skills_required?.length > 2 && (
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                            +{internship.skills_required.length - 2}
                          </span>
                        )}
                      </div>
                      <Link 
                        to={`/internships/${internship.id}`}
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        View
                      </Link>
                    </div>
                  </motion.div>
                ))}
                
                <div className="mt-4 text-center">
                  <Link to="/internships" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View all opportunities
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FaGraduationCap className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Complete your profile to get personalized recommendations
                </p>
                <div className="mt-6">
                  <Link to="/student/profile" className="btn-outline">
                    Update Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Direct Application Modal */}
      {showDirectApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Direct Application</h2>
            
            {!selectedOrganization ? (
              <div>
                <p className="text-gray-600 mb-4">
                  Select an organization to send a direct internship application:
                </p>
                {organizations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {organizations.map(org => (
                      <div
                        key={org.id}
                        onClick={() => handleDirectApplication(org)}
                        className="p-4 border rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50"
                      >
                        <div className="flex items-center">
                          {org.user?.profile_image ? (
                            <img
                              src={org.user.profile_image}
                              alt={org.company_name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <FaBuilding className="w-12 h-12 text-gray-400" />
                          )}
                          <div className="ml-4">
                            <h3 className="font-medium text-gray-800">{org.company_name}</h3>
                            <p className="text-sm text-gray-600">{org.industry}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaBuilding className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="text-gray-500 mt-2">No organizations available yet</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-6">
                  {selectedOrganization.user?.profile_image ? (
                    <img
                      src={selectedOrganization.user.profile_image}
                      alt={selectedOrganization.company_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <FaBuilding className="w-16 h-16 text-gray-400" />
                  )}
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-800">
                      {selectedOrganization.company_name}
                    </h3>
                    <p className="text-gray-600">{selectedOrganization.industry}</p>
                  </div>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <label className="label">Position of Interest</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., Software Developer Intern"
                    />
                  </div>
                  
                  <div>
                    <label className="label">Cover Letter</label>
                    <textarea
                      className="input"
                      rows="6"
                      placeholder="Explain why you're interested in interning at this organization..."
                    />
                  </div>
                  
                  <div>
                    <label className="label">Resume</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <FaFile className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                            <span>Upload a file</span>
                            <input type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDirectApplicationModal(false);
                  setSelectedOrganization(null);
                }}
                className="btn-outline"
              >
                Cancel
              </button>
              {selectedOrganization && (
                <button className="btn-primary">
                  Send Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;