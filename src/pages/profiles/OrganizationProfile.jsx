import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBuilding, FaEnvelope, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const OrganizationProfile = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              {currentUser.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt={currentUser.name}
                  className="w-32 h-32 rounded-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <FaBuilding className="w-16 h-16 text-secondary-300" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {currentUser.name}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaEnvelope className="mr-2" />
                    <span>{currentUser.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{currentUser.location}</span>
                  </div>
                  {currentUser.website && (
                    <div className="flex items-center text-gray-600">
                      <FaGlobe className="mr-2" />
                      <a 
                        href={currentUser.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {currentUser.website}
                      </a>
                    </div>
                  )}
                </div>
                <Link to="/organization/profile/edit" className="btn-primary">
                  Edit Profile
                </Link>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-600">{currentUser.description}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Industry & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Industry</h2>
            <p className="text-gray-600">{currentUser.industry}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Desired Skills</h2>
            <div className="flex flex-wrap gap-2">
              {currentUser.desiredSkills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrganizationProfile;