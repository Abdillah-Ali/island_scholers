import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHandshake, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaUserGraduate,
  FaBuilding,
  FaFileAlt,
  FaTimes,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from 'react-icons/fa';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app this would come from your Django backend
      setApplications([]);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(application =>
        application.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.internship_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.organization_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(application => application.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="w-4 h-4" />;
      case 'under_review':
        return <FaEye className="w-4 h-4" />;
      case 'accepted':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <FaTimesCircle className="w-4 h-4" />;
      case 'withdrawn':
        return <FaTimes className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Application Management</h1>
          <p className="text-gray-600">Monitor and track all internship applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <FaClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {applications.filter(app => app.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <FaEye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Under Review</h3>
              <p className="text-2xl font-bold text-blue-600">
                {applications.filter(app => app.status === 'under_review').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FaCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Accepted</h3>
              <p className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'accepted').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <FaTimesCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Rejected</h3>
              <p className="text-2xl font-bold text-red-600">
                {applications.filter(app => app.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Applications ({filteredApplications.length})
          </h2>
        </div>

        {filteredApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Internship
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <motion.tr
                    key={application.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUserGraduate className="w-8 h-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.student_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.student_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaFileAlt className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {application.internship_title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaBuilding className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {application.organization_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(application.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(application.status)}`}>
                          {application.status.replace('_', ' ').charAt(0).toUpperCase() + application.status.replace('_', ' ').slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.applied_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewApplication(application)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaHandshake className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search filters'
                : 'Applications will appear here once students start applying'
              }
            </p>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showApplicationModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Application Details</h2>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Student Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedApplication.student_name}</p>
                  <p><span className="font-medium">Email:</span> {selectedApplication.student_email}</p>
                  <p><span className="font-medium">Applied:</span> {new Date(selectedApplication.applied_at).toLocaleDateString()}</p>
                  <p><span className="font-medium">Availability:</span> {selectedApplication.availability}</p>
                  <p><span className="font-medium">Preferred Start:</span> {selectedApplication.preferred_start_date}</p>
                </div>
              </div>

              {/* Internship Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Internship Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Position:</span> {selectedApplication.internship_title}</p>
                  <p><span className="font-medium">Organization:</span> {selectedApplication.organization_name}</p>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedApplication.status)}`}>
                      {selectedApplication.status.replace('_', ' ').charAt(0).toUpperCase() + selectedApplication.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Cover Letter</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{selectedApplication.cover_letter}</p>
              </div>
            </div>

            {/* Documents */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Documents</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span>Resume: {selectedApplication.resume}</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Download
                  </button>
                </div>
                {selectedApplication.portfolio_url && (
                  <div className="flex items-center justify-between mt-2">
                    <span>Portfolio</span>
                    <a 
                      href={selectedApplication.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Portfolio
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowApplicationModal(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;