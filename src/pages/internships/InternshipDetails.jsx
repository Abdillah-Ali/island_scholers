import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBuilding, FaMapMarkerAlt, FaClock, FaCalendar, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { internshipsApi, organizationsApi } from '../../services/api';
import { useApi } from '../../hooks/useApi';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [internship, setInternship] = useState(null);
  const [organization, setOrganization] = useState(null);
  
  const { loading, error, execute } = useApi();
  
  useEffect(() => {
    if (id) {
      fetchInternshipDetails();
    }
  }, [id]);

  const fetchInternshipDetails = async () => {
    await execute(
      async () => {
        const internshipData = await internshipsApi.getById(id);
        setInternship(internshipData);
        
        // Fetch organization details if we have the organization reference
        if (internshipData.organization?.id) {
          try {
            const orgData = await organizationsApi.getById(internshipData.organization.id);
            setOrganization(orgData);
          } catch (orgError) {
            console.warn('Could not fetch organization details:', orgError);
            // Use organization data from internship if available
            setOrganization(internshipData.organization);
          }
        }
        
        return internshipData;
      },
      {
        onError: (err) => {
          console.error('Failed to fetch internship details:', err);
        }
      }
    );
  };

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
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center justify-center rounded-md max-w-md mx-auto">
          <FaExclamationTriangle className="mr-3" />
          <div>
            <p className="font-medium">Error loading internship</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/internships')}
          className="mt-4 btn-primary"
        >
          Back to Internships
        </button>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Internship not found</h2>
        <button 
          onClick={() => navigate('/internships')}
          className="mt-4 btn-primary"
        >
          Back to Internships
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {internship.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <FaBuilding className="mr-2" />
                <span>{organization?.companyName || internship.organization?.companyName || 'Organization'}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{internship.location}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{internship.duration?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendar className="mr-1" />
                  <span>Posted {new Date(internship.createdAt).toLocaleDateString()}</span>
                </div>
                {internship.isRemote && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Remote
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              {currentUser?.role === 'student' && (
                <Link 
                  to={`/student/internships/${id}/apply`}
                  className="btn-primary"
                >
                  Apply Now
                </Link>
              )}
              <button 
                onClick={() => navigate(-1)} 
                className="btn-outline"
              >
                Back
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Main Information */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {internship.description}
              </p>
            </div>
            
            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {internship.requirements}
              </p>
            </div>
            
            {/* Required Skills */}
            {internship.skillsRequired && internship.skillsRequired.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {internship.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Additional Information */}
          <div className="space-y-8">
            {/* Organization Info */}
            {organization && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">About the Organization</h2>
                <div className="flex items-center mb-4">
                  {organization.user?.profileImage ? (
                    <img
                      src={organization.user.profileImage}
                      alt={organization.companyName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <FaBuilding className="w-16 h-16 text-gray-400" />
                  )}
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-800">{organization.companyName}</h3>
                    <p className="text-sm text-gray-600 capitalize">{organization.industry}</p>
                  </div>
                </div>
                {organization.description && (
                  <p className="text-gray-600 mb-4">{organization.description}</p>
                )}
                {organization.website && (
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            )}
            
            {/* Key Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Key Details</h2>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <FaCheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                  <span>Duration: {internship.duration?.replace('_', ' ')}</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <FaCheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                  <span>Location: {internship.location}</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <FaCheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                  <span>Remote Work: {internship.isRemote ? 'Yes' : 'No'}</span>
                </li>
                {internship.applicationDeadline && (
                  <li className="flex items-center text-gray-600">
                    <FaCheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                    <span>Application Deadline: {new Date(internship.applicationDeadline).toLocaleDateString()}</span>
                  </li>
                )}
                {internship.stipendAmount && (
                  <li className="flex items-center text-gray-600">
                    <FaCheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                    <span>Stipend: TZS {parseInt(internship.stipendAmount).toLocaleString()}</span>
                  </li>
                )}
                {internship.maxApplicants && (
                  <li className="flex items-center text-gray-600">
                    <FaCheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                    <span>Max Applicants: {internship.maxApplicants}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InternshipDetails;