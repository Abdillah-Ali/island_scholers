import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFileAlt, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaBuilding,
  FaMapMarkerAlt,
  FaClock,
  FaCheck,
  FaBan,
  FaTimes,
  FaCalendarAlt
} from 'react-icons/fa';

const AdminInternships = () => {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [internshipToDelete, setInternshipToDelete] = useState(null);

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    filterInternships();
  }, [internships, searchTerm, statusFilter]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app this would come from your Django backend
      setInternships([]);
    } catch (err) {
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterInternships = () => {
    let filtered = internships;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(internship => internship.is_active);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(internship => !internship.is_active);
      } else if (statusFilter === 'expired') {
        filtered = filtered.filter(internship => 
          new Date(internship.application_deadline) < new Date()
        );
      }
    }

    setFilteredInternships(filtered);
  };

  const handleViewInternship = (internship) => {
    setSelectedInternship(internship);
    setShowInternshipModal(true);
  };

  const handleDeleteInternship = (internship) => {
    setInternshipToDelete(internship);
    setShowDeleteModal(true);
  };

  const confirmDeleteInternship = async () => {
    try {
      // In a real app, this would be an API call
      setInternships(prev => prev.filter(internship => internship.id !== internshipToDelete.id));
      setShowDeleteModal(false);
      setInternshipToDelete(null);
    } catch (err) {
      console.error('Error deleting internship:', err);
    }
  };

  const toggleInternshipStatus = async (internshipId, currentStatus) => {
    try {
      // In a real app, this would be an API call
      setInternships(prev => prev.map(internship => 
        internship.id === internshipId 
          ? { ...internship, is_active: !currentStatus }
          : internship
      ));
    } catch (err) {
      console.error('Error updating internship status:', err);
    }
  };

  const getStatusBadgeColor = (internship) => {
    if (!internship.is_active) {
      return 'bg-red-100 text-red-800';
    }
    if (new Date(internship.application_deadline) < new Date()) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (internship) => {
    if (!internship.is_active) {
      return 'Inactive';
    }
    if (new Date(internship.application_deadline) < new Date()) {
      return 'Expired';
    }
    return 'Active';
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
          <h1 className="text-3xl font-bold text-gray-800">Internship Management</h1>
          <p className="text-gray-600">Monitor and manage all internship postings</p>
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
                placeholder="Search internships..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Internships Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Internships ({filteredInternships.length})
          </h2>
        </div>

        {filteredInternships.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Internship
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInternships.map((internship) => (
                  <motion.tr
                    key={internship.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {internship.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaClock className="w-3 h-3 mr-1" />
                          {internship.duration?.replace('_', ' ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaBuilding className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {internship.organization_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaMapMarkerAlt className="w-3 h-3 text-gray-400 mr-1" />
                        {internship.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(internship)}`}>
                        {getStatusText(internship)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {internship.applications_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewInternship(internship)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleInternshipStatus(internship.id, internship.is_active)}
                          className={`${internship.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          title={internship.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {internship.is_active ? <FaBan className="w-4 h-4" /> : <FaCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteInternship(internship)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Internship"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaFileAlt className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No internships found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search filters'
                : 'Internships will appear here once organizations post them'
              }
            </p>
          </div>
        )}
      </div>

      {/* Internship Details Modal */}
      {showInternshipModal && selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Internship Details</h2>
              <button
                onClick={() => setShowInternshipModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedInternship.title}</h3>
                  <p className="text-gray-600">{selectedInternship.organization_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedInternship.duration?.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInternship.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Remote</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedInternship.is_remote ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stipend</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedInternship.stipend_amount 
                        ? `TZS ${parseInt(selectedInternship.stipend_amount).toLocaleString()}`
                        : 'Not specified'
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedInternship.application_deadline).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedInternship)}`}>
                    {getStatusText(selectedInternship)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedInternship.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Requirements</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedInternship.requirements}</p>
                </div>

                {selectedInternship.skills_required && selectedInternship.skills_required.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Required Skills</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedInternship.skills_required.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Applications</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedInternship.applications_count || 0}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Posted</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedInternship.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => toggleInternshipStatus(selectedInternship.id, selectedInternship.is_active)}
                className={`px-4 py-2 rounded-md ${
                  selectedInternship.is_active 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {selectedInternship.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => setShowInternshipModal(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && internshipToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <FaTrash className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-xl font-bold">Delete Internship</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{internshipToDelete.title}</strong>? 
              This action cannot be undone and will affect all related applications.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteInternship}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInternships;