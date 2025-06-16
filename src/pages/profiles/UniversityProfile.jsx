import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUniversity, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const UniversityProfile = () => {
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
                <div className="w-32 h-32 bg-accent-100 rounded-lg flex items-center justify-center">
                  <FaUniversity className="w-16 h-16 text-accent-300" />
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
                <Link to="/university/profile/edit" className="btn-primary">
                  Edit Profile
                </Link>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-600">{currentUser.description}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* University Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <FaGraduationCap className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Students</h3>
                <p className="text-2xl font-bold text-primary-600">
                  {currentUser.studentCount?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mr-4">
                <FaUsers className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Faculty</h3>
                <p className="text-2xl font-bold text-secondary-600">
                  {currentUser.facultyCount?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                <FaCalendarAlt className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Established</h3>
                <p className="text-2xl font-bold text-accent-600">
                  {currentUser.establishedYear || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Academic Programs */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Academic Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentUser.programs?.map((program, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-primary-50 text-primary-800 rounded-lg text-center"
              >
                {program}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UniversityProfile;