import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaBuilding, FaMapMarkerAlt, FaBriefcase, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { organizationsApi } from '../../services/api';
import { useApi } from '../../hooks/useApi';

const OrganizationList = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [industry, setIndustry] = useState('');
  
  const { loading, error, execute } = useApi();
  
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async (filters = {}) => {
    await execute(
      () => organizationsApi.getAll(filters),
      {
        onSuccess: (data) => {
          setOrganizations(data);
        },
        onError: (err) => {
          console.error('Failed to fetch organizations:', err);
          setOrganizations([]);
        }
      }
    );
  };

  const handleSearch = () => {
    const filters = {};
    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    }
    if (industry) {
      filters.industry = industry;
    }
    fetchOrganizations(filters);
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, industry]);

  const industries = [
    'TECHNOLOGY',
    'TELECOMMUNICATIONS', 
    'BANKING',
    'AVIATION',
    'HEALTHCARE',
    'EDUCATION',
    'MANUFACTURING',
    'AGRICULTURE',
    'TOURISM',
    'OTHER'
  ];

  if (loading && organizations.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Organizations</h1>
        <p className="text-gray-600">Discover leading organizations across Tanzania and Zanzibar</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center rounded-md">
          <FaExclamationTriangle className="mr-3" />
          <div>
            <p className="font-medium">Error loading organizations</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => fetchOrganizations()}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
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
          <div className="md:w-64">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="input"
            >
              <option value="">All Industries</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>
                  {ind.charAt(0) + ind.slice(1).toLowerCase().replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mr-2"></div>
              Searching...
            </div>
          )}
        </div>
      </div>
      
      {/* Organizations List */}
      {organizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map(org => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                {org.user?.profileImage ? (
                  <img
                    src={org.user.profileImage}
                    alt={org.companyName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <FaBuilding className="w-8 h-8 text-secondary-600" />
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">{org.companyName}</h3>
                  <p className="text-gray-600 capitalize">
                    {org.industry?.toLowerCase().replace('_', ' ')}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">{org.description}</p>
              
              {org.user?.location && (
                <div className="flex items-center text-gray-600 mb-4">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{org.user.location}</span>
                </div>
              )}

              {org.website && (
                <div className="flex items-center text-gray-600 mb-4">
                  <FaBriefcase className="mr-2" />
                  <a 
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              
              {isAuthenticated && currentUser.role === 'student' && (
                <div className="mt-4 flex justify-between items-center">
                  <Link
                    to={`/internships?organization=${org.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Internships
                  </Link>
                  <button
                    onClick={() => {/* Handle direct application */}}
                    className="btn-outline text-sm"
                  >
                    Apply Directly
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaBuilding className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {searchTerm || industry ? 'No organizations found' : 'No organizations yet'}
          </h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || industry 
              ? 'Try adjusting your search filters' 
              : 'Organizations will appear here once they register on the platform'
            }
          </p>
          {!isAuthenticated && (
            <div className="mt-6">
              <Link to="/register" className="btn-primary">
                Register Your Organization
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationList;