import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBuilding, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaCheck,
  FaBan,
  FaTimes,
  FaUserShield,
  FaGlobe,
  FaMapMarkerAlt,
  FaIndustry
} from 'react-icons/fa';

const AdminOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [showOrganizationModal, setShowOrganizationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    filterOrganizations();
  }, [organizations, searchTerm, industryFilter, statusFilter]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app this would come from your Django backend
      setOrganizations([]);
    } catch (err) {
      console.error('Error fetching organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterOrganizations = () => {
    let filtered = organizations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(org =>
        org.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Industry filter
    if (industryFilter !== 'all') {
      filtered = filtered.filter(org => org.industry === industryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(org => org.user?.is_active);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(org => !org.user?.is_active);
      } else if (statusFilter === 'verified') {
        filtered = filtered.filter(org => org.user?.is_verified);
      } else if (statusFilter === 'unverified') {
        filtered = filtered.filter(org => !org.user?.is_verified);
      }
    }

    setFilteredOrganizations(filtered);
  };

  const handleViewOrganization = (organization) => {
    setSelectedOrganization(organization);
    setShowOrganizationModal(true);
  };

  const handleDeleteOrganization = (organization) => {
    setOrganizationToDelete(organization);
    setShowDeleteModal(true);
  };

  const confirmDeleteOrganization = async () => {
    try {
      // In a real app, this would be an API call
      setOrganizations(prev => prev.filter(org => org.id !== organizationToDelete.id));
      setShowDeleteModal(false);
      setOrganizationToDelete(null);
    } catch (err) {
      console.error('Error deleting organization:', err);
    }
  };

  const toggleOrganizationStatus = async (organizationId, currentStatus) => {
    try {
      // In a real app, this would be an API call
      setOrganizations(prev => prev.map(org => 
        org.id === organizationId 
          ? { ...org, user: { ...org.user, is_active: !currentStatus } }
          : org
      ));
    } catch (err) {
      console.error('Error updating organization status:', err);
    }
  };

  const verifyOrganization = async (organizationId) => {
    try {
      // In a real app, this would be an API call
      setOrganizations(prev => prev.map(org => 
        org.id === organizationId 
          ? { ...org, user: { ...org.user, is_verified: true } }
          : org
      ));
    } catch (err) {
      console.error('Error verifying organization:', err);
    }
  };

  const getIndustryBadgeColor = (industry) => {
    switch (industry) {
      case 'technology':
        return 'bg-blue-100 text-blue-800';
      case 'telecommunications':
        return 'bg-purple-100 text-purple-800';
      case 'banking':
        return 'bg-green-100 text-green-800';
      case 'healthcare':
        return 'bg-red-100 text-red-800';
      case 'education':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-800">Organization Management</h1>
          <p className="text-gray-600">Monitor and manage all registered organizations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Industry Filter */}
          <div>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Industries</option>
              <option value="technology">Technology</option>
              <option value="telecommunications">Telecommunications</option>
              <option value="banking">Banking & Finance</option>
              <option value="aviation">Aviation</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="agriculture">Agriculture</option>
              <option value="tourism">Tourism</option>
              <option value="other">Other</option>
            </select>
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
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Organizations ({filteredOrganizations.length})
          </h2>
        </div>

        {filteredOrganizations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrganizations.map((organization) => (
                  <motion.tr
                    key={organization.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {organization.user?.profile_image ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={organization.user.profile_image}
                              alt={organization.company_name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-300 flex items-center justify-center">
                              <FaBuilding className="h-5 w-5 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {organization.company_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {organization.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getIndustryBadgeColor(organization.industry)}`}>
                        {organization.industry}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaMapMarkerAlt className="w-3 h-3 text-gray-400 mr-1" />
                        {organization.user?.location || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          organization.user?.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {organization.user?.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          organization.user?.is_verified 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {organization.user?.is_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(organization.user?.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewOrganization(organization)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleOrganizationStatus(organization.id, organization.user?.is_active)}
                          className={`${organization.user?.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          title={organization.user?.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {organization.user?.is_active ? <FaBan className="w-4 h-4" /> : <FaCheck className="w-4 h-4" />}
                        </button>
                        {!organization.user?.is_verified && (
                          <button
                            onClick={() => verifyOrganization(organization.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Verify Organization"
                          >
                            <FaUserShield className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrganization(organization)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Organization"
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
            <FaBuilding className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || industryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search filters'
                : 'Organizations will appear here once they register on the platform'
              }
            </p>
          </div>
        )}
      </div>

      {/* Organization Details Modal */}
      {showOrganizationModal && selectedOrganization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Organization Details</h2>
              <button
                onClick={() => setShowOrganizationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {selectedOrganization.user?.profile_image ? (
                    <img
                      className="h-20 w-20 rounded-lg object-cover"
                      src={selectedOrganization.user.profile_image}
                      alt={selectedOrganization.company_name}
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-gray-300 flex items-center justify-center">
                      <FaBuilding className="h-10 w-10 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{selectedOrganization.company_name}</h3>
                    <p className="text-gray-600">{selectedOrganization.user?.email}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getIndustryBadgeColor(selectedOrganization.industry)}`}>
                      {selectedOrganization.industry}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1 space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedOrganization.user?.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedOrganization.user?.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedOrganization.user?.is_verified 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedOrganization.user?.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Size</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedOrganization.company_size || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Founded</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedOrganization.founded_year || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Joined</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedOrganization.user?.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedOrganization.user?.location || 'Not specified'}
                  </p>
                </div>

                {selectedOrganization.website && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <a 
                      href={selectedOrganization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FaGlobe className="w-3 h-3 mr-1" />
                      {selectedOrganization.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedOrganization.description}</p>
                </div>

                {selectedOrganization.registration_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrganization.registration_number}</p>
                  </div>
                )}

                {selectedOrganization.desired_skills && selectedOrganization.desired_skills.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Desired Skills</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedOrganization.desired_skills.map((skill, index) => (
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
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => toggleOrganizationStatus(selectedOrganization.id, selectedOrganization.user?.is_active)}
                className={`px-4 py-2 rounded-md ${
                  selectedOrganization.user?.is_active 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {selectedOrganization.user?.is_active ? 'Deactivate' : 'Activate'}
              </button>
              {!selectedOrganization.user?.is_verified && (
                <button
                  onClick={() => verifyOrganization(selectedOrganization.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Verify
                </button>
              )}
              <button
                onClick={() => setShowOrganizationModal(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && organizationToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <FaTrash className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-xl font-bold">Delete Organization</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{organizationToDelete.company_name}</strong>? 
              This action cannot be undone and will affect all related internships and applications.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOrganization}
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

export default AdminOrganizations;