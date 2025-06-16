import { motion } from 'framer-motion';
import { 
  FaGraduationCap, 
  FaCheckCircle, 
  FaClock, 
  FaUserTie, 
  FaDownload, 
  FaEye,
  FaBuilding,
  FaCalendarAlt
} from 'react-icons/fa';

const StudentApplicationCard = ({ 
  application, 
  onConfirm, 
  onAssignSupervisor, 
  onViewDetails, 
  onDownloadLetter 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniversityStatusColor = (confirmed) => {
    return confirmed 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
    >
      {/* Student Info Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            {application.student_details?.profileImage ? (
              <img 
                className="h-12 w-12 rounded-full object-cover" 
                src={application.student_details.profileImage} 
                alt={application.student_details.name}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <FaGraduationCap className="h-6 w-6 text-primary-600" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {application.student_details?.name}
            </h3>
            <p className="text-sm text-gray-600">
              {application.student_details?.fieldOfStudy} • Year {application.student_details?.yearOfStudy}
            </p>
            <p className="text-xs text-gray-500">
              ID: {application.student_details?.studentId}
            </p>
          </div>
        </div>
        
        {/* Status Badges */}
        <div className="flex flex-col items-end space-y-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUniversityStatusColor(application.university_confirmation)}`}>
            {application.university_confirmation ? 'Confirmed' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Internship Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center mb-2">
          <FaBuilding className="h-4 w-4 text-gray-500 mr-2" />
          <span className="font-medium text-gray-900">{application.organization_details?.name}</span>
        </div>
        <h4 className="font-semibold text-gray-800 mb-1">{application.internship_details?.title}</h4>
        <div className="flex items-center text-sm text-gray-600">
          <FaCalendarAlt className="h-3 w-3 mr-1" />
          <span>{application.internship_details?.duration?.replace('_', ' ')} • {application.internship_details?.location}</span>
        </div>
      </div>

      {/* University Confirmation Status */}
      {application.university_confirmation && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h5 className="font-medium text-blue-900 mb-2">University Confirmation</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-blue-700">Start:</span> {application.university_confirmation.start_date}
            </div>
            <div>
              <span className="text-blue-700">End:</span> {application.university_confirmation.end_date}
            </div>
          </div>
          {application.supervisor_assigned && (
            <div className="mt-2 text-sm">
              <span className="text-blue-700">Supervisor:</span> {application.supervisor_assigned.supervisor_name}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(application)}
            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            <FaEye className="h-3 w-3 mr-1" />
            View
          </button>
          
          {application.university_confirmation && (
            <button
              onClick={() => onDownloadLetter(application)}
              className="inline-flex items-center px-3 py-1 border border-purple-300 rounded-md text-sm text-purple-700 hover:bg-purple-50"
            >
              <FaDownload className="h-3 w-3 mr-1" />
              Letter
            </button>
          )}
        </div>

        <div className="flex space-x-2">
          {!application.university_confirmation && application.status === 'accepted' && (
            <button
              onClick={() => onConfirm(application)}
              className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
            >
              <FaCheckCircle className="h-3 w-3 mr-1" />
              Confirm
            </button>
          )}
          
          {application.university_confirmation && !application.supervisor_assigned && (
            <button
              onClick={() => onAssignSupervisor(application)}
              className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              <FaUserTie className="h-3 w-3 mr-1" />
              Assign
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentApplicationCard;