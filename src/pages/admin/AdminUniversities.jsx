import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUniversity, 
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
  FaGraduationCap,
  FaUsers
} from 'react-icons/fa';

const AdminUniversities = () => {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    filterUniversities();
  }, [universities, searchTerm, statusFilter]);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app this would come from your Django backend
      setUniversities([]);
    } catch (err) {
      console.error('Error fetching universities:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterUniversities = () => {
    let filtered = universities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(university =>
        university.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(university => university.user?.is_active);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(university => !university.user?.is_active);
      } else if (statusFilter === 'verified') {
        filtered = filtered.filter(university => university.user?.is_verified);
      } else if (statusFilter === 'unverified') {
        filtered = filtered.filter(university => !university.user?.is_verified);
      }
    }

    setFilteredUniversities(filtered);
  };

  const handleViewUniversity = (university) => {
    setSelectedUniversity(university);
    setShowUniversityModal(true);
  };

  const handleDeleteUniversity = (university) => {
    setUniversityToDelete(university);
    setShowDeleteModal(true);
  };

  const confirmDeleteUniversity = async () => {
    try {
      // In a real app, this would be an API call
      setUniversities(prev => prev.filter(university => university.id !== universityToDelete.id));
      setShowDeleteModal(false);
      setUniversityToDelete(null);
    } catch (err) {
      console.error('Error deleting university:', err);
    }
  };

  const toggleUniversityStatus = async (universityId, currentStatus) => {
    try {
      // In a real app, this would be an API call
      setUniversities(prev => prev.map(university => 
        university.id === universityId 
          ? { ...university, user: { ...university.user, is_active: !currentStatus } }
          : university
      ));
    } catch (err) {
      console.error('Error updating university status:', err);
    }
  };

  const verifyUniversity = async (universityId) => {
    try {
      // In a real app, this would be an API call
      setUniversities(prev => prev.map(university => 
        university.id === universityId 
          ? { ...university, user: { ...university.user, is_verified: true } }
          : university
      ));
    } catch (err) {
      console.error('Error verifying university:', err);
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
          <h1 className="text-3xl font-bold text-gray-800">University Management</h1>
          <p className="text-gray-600">Monitor and manage all partner universities</p>
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
                placeholder="Search universities..."
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
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Universities Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Universities ({filteredUniversities.length})
          </h2>
        </div>

        {filteredUniversities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
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
                {filteredUniversities.map((university) => (
                  <motion.tr
                    key={university.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {university.user?.profile_image ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={university.user.profile_image}
                              alt={university.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-300 flex items-center justify-center">
                              <FaUniversity className="h-5 w-5 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {university.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {university.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaMapMarkerAlt className="w-3 h-3 text-gray-400 mr-1" />
                        {university.location || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaGraduationCap className="w-3 h-3 text-gray-400 mr-1" />
                        {university.student_count?.toLocaleString() || '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          university.user?.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {university.user?.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          university.user?.is_verified 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {university.user?.is_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(university.user?.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewUniversity(university)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleUniversityStatus(university.id, university.user?.is_active)}
                          className={`${university.user?.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          title={university.user?.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {university.user?.is_active ? <FaBan className="w-4 h-4" /> : <FaCheck className="w-4 h-4" />}
                        </button>
                        {!university.user?.is_verified && (
                          <button
                            onClick={() => verifyUniversity(university.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Verify University"
                          >
                            <FaUserShield className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUniversity(university)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete University"
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
            <FaUniversity className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No universities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search filters'
                : 'Universities will appear here once they register on the platform'
              }
            </p>
          </div>
        )}
      </div>

      {/* University Details Modal */}
      {showUniversityModal && selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">University Details</h2>
              <button
                onClick={() => setShowUniversityModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {selectedUniversity.user?.profile_image ? (
                    <img
                      className="h-20 w-20 rounded-lg object-cover"
                      src={selectedUniversity.user.profile_image}
                      alt={selectedUniversity.name}
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-gray-300 flex items-center justify-center">
                      <FaUniversity className="h-10 w-10 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{selectedUniversity.name}</h3>
                    <p className="text-gray-600">{selectedUniversity.user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1 space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedUniversity.user?.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUniversity.user?.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedUniversity.user?.is_verified 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedUniversity.user?.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Established</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUniversity.established_year || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Students</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUniversity.student_count?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Faculty</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUniversity.faculty_count?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Joined</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedUniversity.user?.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedUniversity.location || 'Not specified'}
                  </p>
                </div>

                {selectedUniversity.website && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <a 
                      href={selectedUniversity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FaGlobe className="w-3 h-3 mr-1" />
                      {selectedUniversity.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUniversity.description}</p>
                </div>

                {selectedUniversity.programs && selectedUniversity.programs.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Academic Programs</label>
                    <div className="mt-1 grid grid-cols-1 gap-2">
                      {selectedUniversity.programs.map((program, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 bg-primary-50 text-primary-800 rounded-lg text-sm"
                        >
                          {program}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => toggleUniversityStatus(selectedUniversity.id, selectedUniversity.user?.is_active)}
                className={`px-4 py-2 rounded-md ${
                  selectedUniversity.user?.is_active 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {selectedUniversity.user?.is_active ? 'Deactivate' : 'Activate'}
              </button>
              {!selectedUniversity.user?.is_verified && (
                <button
                  onClick={() => verifyUniversity(selectedUniversity.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Verify
                </button>
              )}
              <button
                onClick={() => setShowUniversityModal(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && universityToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <FaTrash className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-xl font-bold">Delete University</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{universityToDelete.name}</strong>? 
              This action cannot be undone and will affect all related students and applications.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUniversity}
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

export default AdminUniversities;