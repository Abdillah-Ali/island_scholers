import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaUniversity, FaFileAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const StudentProfile = () => {
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
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center">
                  <FaUser className="w-16 h-16 text-primary-300" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {currentUser.name}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaEnvelope className="mr-2" />
                    <span>{currentUser.email}</span>
                  </div>
                </div>
                <Link to="/student/profile/edit" className="btn-primary">
                  Edit Profile
                </Link>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-600">{currentUser.bio}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Education & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            <div className="flex items-center text-gray-600 mb-4">
              <FaUniversity className="mr-2" />
              <span>{currentUser.university}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {currentUser.skills?.map((skill, index) => (
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
        
        {/* Documents */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          <div className="space-y-4">
            {/* CV */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <FaFileAlt className="w-6 h-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="font-medium">CV/Resume</h3>
                  <p className="text-sm text-gray-500">
                    {currentUser.documents?.cv ? 'Uploaded' : 'Not uploaded'}
                  </p>
                </div>
              </div>
              <button className="btn-outline">
                {currentUser.documents?.cv ? 'Update' : 'Upload'}
              </button>
            </div>
            
            {/* University Letter */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <FaFileAlt className="w-6 h-6 text-gray-400 mr-3" />
                <div>
                  <h3 className="font-medium">University Letter</h3>
                  <p className="text-sm text-gray-500">
                    {currentUser.documents?.universityLetter ? 'Uploaded' : 'Not uploaded'}
                  </p>
                </div>
              </div>
              <button className="btn-outline">
                {currentUser.documents?.universityLetter ? 'Update' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentProfile;