import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaClock, FaBuilding, FaFilter } from 'react-icons/fa';

const InternshipExplore = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    remote: false,
    duration: '',
    skills: []
  });
  
  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to your Django backend
      // const response = await fetch('/api/internships/');
      // const data = await response.json();
      
      // For now, we'll use an empty array since we removed sample data
      setInternships([]);
      setError('');
    } catch (err) {
      setError('Failed to fetch internships');
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };
  
  const handleLocationChange = (e) => {
    setFilters(prev => ({ ...prev, location: e.target.value }));
  };
  
  const handleRemoteChange = (e) => {
    setFilters(prev => ({ ...prev, remote: e.target.checked }));
  };

  const handleDurationChange = (e) => {
    setFilters(prev => ({ ...prev, duration: e.target.value }));
  };

  // Filter internships based on current filters
  const filteredInternships = internships.filter(internship => {
    const matchesSearch = filters.search === '' || 
      internship.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      internship.description?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesLocation = filters.location === '' || 
      internship.location?.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesRemote = !filters.remote || internship.is_remote;
    
    const matchesDuration = filters.duration === '' || internship.duration === filters.duration;
    
    return matchesSearch && matchesLocation && matchesRemote && matchesDuration;
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
          onClick={fetchInternships}
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore Internships</h1>
        <p className="text-gray-600">Find amazing internship opportunities across Tanzania and Zanzibar</p>
      </div>

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
                value={filters.search}
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
              <option value="1_month">1 Month</option>
              <option value="2_months">2 Months</option>
              <option value="3_months">3 Months</option>
              <option value="4_months">4 Months</option>
              <option value="5_months">5 Months</option>
              <option value="6_months">6 Months</option>
              <option value="other">Other</option>
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

          {(filters.search || filters.location || filters.remote || filters.duration) && (
            <button
              onClick={() => setFilters({
                search: '',
                location: '',
                remote: false,
                duration: '',
                skills: []
              })}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Internship Listings */}
      {filteredInternships.length > 0 ? (
        <div className="space-y-6">
          {filteredInternships.map(internship => (
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
                  {internship.organization?.profile_image ? (
                    <img
                      src={internship.organization.profile_image}
                      alt={internship.organization_name}
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
                      <div className="text-gray-600">{internship.organization_name}</div>
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
                    {internship.is_remote && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Remote
                      </span>
                    )}
                    {internship.stipend_amount && (
                      <span className="bg-accent-100 text-accent-800 text-xs px-2 py-1 rounded-full">
                        TZS {parseInt(internship.stipend_amount).toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  {internship.skills_required && internship.skills_required.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {internship.skills_required.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {internship.skills_required.length > 5 && (
                        <span className="bg-gray-50 text-gray-700 text-sm px-3 py-1 rounded-full">
                          +{internship.skills_required.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {internship.application_deadline && (
                    <div className="mt-3 text-sm text-gray-500">
                      Application deadline: {new Date(internship.application_deadline).toLocaleDateString()}
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
            {Object.values(filters).some(f => f && f !== false && (!Array.isArray(f) || f.length > 0)) 
              ? 'No internships found' 
              : 'No internships available yet'
            }
          </h3>
          <p className="mt-1 text-gray-500">
            {Object.values(filters).some(f => f && f !== false && (!Array.isArray(f) || f.length > 0))
              ? 'Try adjusting your search filters'
              : 'Internships will appear here once organizations post them'
            }
          </p>
          {!Object.values(filters).some(f => f && f !== false && (!Array.isArray(f) || f.length > 0)) && (
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