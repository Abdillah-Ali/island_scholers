import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBuilding, FaMapMarkerAlt, FaClock, FaCalendar, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { mockInternships, mockUsers } from '../../data/mockData';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Find the internship details
  const internship = mockInternships.find(i => i.id === id);
  const organization = mockUsers.find(u => u.id === internship?.organizationId);
  
  if (!internship || !organization) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Internship not found</h2>
        <button 
          onClick={() => navigate('/student/internships')}
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
                <span>{organization.name}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{internship.location}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{internship.duration}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendar className="mr-1" />
                  <span>Posted {new Date(internship.postedDate).toLocaleDateString()}</span>
                </div>
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
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Additional Information */}
          <div className="space-y-8">
            {/* Organization Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">About the Organization</h2>
              <div className="flex items-center mb-4">
                {organization.profileImage ? (
                  <img
                    src={organization.profileImage}
                    alt={organization.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <FaBuilding className="w-16 h-16 text-gray-400" />
                )}
                <div className="ml-4">
                  <h3 className="font-medium text-gray-800">{organization.name}</h3>
                  <p className="text-sm text-gray-600">{organization.industry}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{organization.description}</p>
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Visit Website
              </a>
            </div>
            
            {/* Key Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Key Details</h2>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <FaCheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                  <span>Duration: {internship.duration}</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <FaCheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                  <span>Location: {internship.location}</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <FaCheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                  <span>Remote Work: {internship.isRemote ? 'Yes' : 'No'}</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <FaCheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                  <span>Application Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InternshipDetails;