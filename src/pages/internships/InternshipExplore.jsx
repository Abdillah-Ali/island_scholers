import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaClock, FaBuilding, FaFilter, FaExclamationTriangle } from 'react-icons/fa';
import { internshipsApi } from '../../services/api';
import { useApi } from '../../hooks/useApi';

const InternshipExplore = () => {
  const [internships, setInternships] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    remote: false,
    duration: ''
  });
  
  const { loading, error, execute, clearError } = useApi();

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async (searchFilters = {}) => {
    await execute(
      () => internshipsApi.getAll(searchFilters),
      {
        onSuccess: (data) => {
          setInternships(data);
          clearError();
        },
        onError: (err) => {
          console.error('Failed to fetch internships:', err);
          setInternships([]);
        }
      }
    );
  };

  const handleSearchChange = (e) => {
    const newFilters = { ...filters, title: e.target.value };
    setFilters(newFilters);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchInternships(newFilters);
    }, 500);
  };
  
  const handleLocationChange = (e) => {
    const newFilters = { ...filters, location: e.target.value };
    setFilters(newFilters);
    
    clearTimeout(window.locationTimeout);
    window.locationTimeout = setTimeout(() => {
      fetchInternships(newFilters);
    }, 500);
  };
  
  const handleRemoteChange = (e) => {
    const newFilters = { ...filters, isRemote: e.target.checked };
    setFilters(newFilters);
    fetchInternships(newFilters);
  };

  const handleDurationChange = (e) => {
    const newFilters = { ...filters, duration: e.target.value };
    setFilters(newFilters);
    fetchInternships(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      title: '',
      location: '',
      remote: false,
      duration: ''
    };
    setFilters(clearedFilters);
    fetchInternships();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== false && value !== ''
  );

  if (loading && internships.length === 0) {
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore Internships</h1>
        <p className="text-gray-600">Find amazing internship opportunities across Tanzania and Zanzibar</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center rounded-md">
          <FaExclamationTriangle className="mr-3" />
          <div>
            <p className="font-medium">Error loading internships</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => fetchInternships(filters)}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search internships..."
                value={filters.title}
                onChange={handleSearchChange}
                className="input pl-10"
              />
            </div>
          </div>
          
          {/* Location */}
          <div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Location..."
                value={filters.location}
                onChange={handleLocationChange}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <select
              value={filters.duration}
              onChange={handleDurationChange}
              className="input"
            >
              <option value="">All Durations</option>
              <option value="ONE_MONTH">1 Month</option>
              <option value="TWO_MONTHS">2 Months</option>
              <option value="THREE_MONTHS">3 Months</option>
              <option value="FOUR_MONTHS">4 Months</option>
              <option value="FIVE_MONTHS">5 Months</option>
              <option value="SIX_MONTHS">6 Months</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remote"
              checked={filters.remote}
              onChange={handleRemoteChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remote" className="ml-2 text-gray-700">
              Remote Only
            </label>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear Filters
            </button>
          )}

          {loading && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mr-2"></div>
              Searching...
            </div>
          )}
        </div>
      </div>
      
      {/* Internship Listings */}
      {internships.length > 0 ? (
        <div className="space-y-6">
          {internships.map(internship => (
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Organization Logo */}
                <div className="flex-shrink-0">
                  {internship.organization?.profileImage ? (
                    <img
                      src={internship.organization.profileImage}
                      alt={internship.organization?.companyName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FaBuilding className="w-8 h-8 text-primary-600" />
                    </div>
                  )}
                </div>
                
                {/* Internship Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {internship.title}
                      </h2>
                      <div className="text-gray-600">{internship.organization?.companyName}</div>
                    </div>
                    
                    <Link
                      to={`/internships/${internship.id}`}
                      className="btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                  
                  <p className="text-gray-600 mt-2">
                    {internship.description?.substring(0, 200)}...
                  </p>
                  
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{internship.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-1" />
                      <span>{internship.duration?.replace('_', ' ')}</span>
                    </div>
                    {internship.isRemote && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Remote
                      </span>
                    )}
                    {internship.stipendAmount && (
                      <span className="bg-accent-100 text-accent-800 text-xs px-2 py-1 rounded-full">
                        TZS {parseInt(internship.stipendAmount).toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  {internship.skillsRequired && internship.skillsRequired.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {internship.skillsRequired.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {internship.skillsRequired.length > 5 && (
                        <span className="bg-gray-50 text-gray-700 text-sm px-3 py-1 rounded-full">
                          +{internship.skillsRequired.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {internship.applicationDeadline && (
                    <div className="mt-3 text-sm text-gray-500">
                      Application deadline: {new Date(internship.applicationDeadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {hasActiveFilters 
              ? 'No internships found' 
              : 'No internships available yet'
            }
          </h3>
          <p className="mt-1 text-gray-500">
            {hasActiveFilters
              ? 'Try adjusting your search filters'
              : 'Internships will appear here once organizations post them'
            }
          </p>
          {!hasActiveFilters && (
            <div className="mt-6">
              <Link to="/register" className="btn-primary">
                Post an Internship
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InternshipExplore;