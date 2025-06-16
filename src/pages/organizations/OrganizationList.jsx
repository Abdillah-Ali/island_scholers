import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaBuilding, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const OrganizationList = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to your Django backend
      // const response = await fetch('/api/organizations/');
      // const data = await response.json();
      
      // For now, we'll use an empty array since we removed sample data
      setOrganizations([]);
      setError('');
    } catch (err) {
      setError('Failed to fetch organizations');
      console.error('Error fetching organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = searchTerm === '' || 
      org.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = industry === '' || org.industry === industry;
    
    return matchesSearch && matchesIndustry;
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={fetchOrganizations}
          className="btn-primary"
        >
          Try Again
        </button>
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
        </div>
      </div>
      
      {/* Organizations List */}
      {filteredOrganizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map(org => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                {org.user?.profile_image ? (
                  <img
                    src={org.user.profile_image}
                    alt={org.company_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <FaBuilding className="w-8 h-8 text-secondary-600" />
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">{org.company_name}</h3>
                  <p className="text-gray-600 capitalize">{org.industry}</p>
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