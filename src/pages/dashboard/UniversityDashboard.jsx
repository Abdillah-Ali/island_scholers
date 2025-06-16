import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUniversity, 
  FaBuilding, 
  FaGraduationCap, 
  FaHandshake, 
  FaFileAlt, 
  FaUserTie, 
  FaCheckCircle, 
  FaClock,
  FaEye,
  FaDownload,
  FaUserCheck,
  FaExclamationTriangle,
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { mockApplications, mockUsers, mockSupervisors, mockInternships } from '../../data/mockData';
import StatCard from '../../components/dashboard/StatCard';
import StudentApplicationCard from '../../components/university/StudentApplicationCard';

const UniversityDashboard = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSupervisorModal, setShowSupervisorModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    supervisor: '',
    startDate: '',
    endDate: '',
    requirements: '',
    objectives: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUniversityData();
  }, [currentUser]);

  const fetchUniversityData = async () => {
    try {
      setLoading(true);
      
      // Get students from this university
      const universityStudents = mockUsers.filter(user => 
        user.role === 'student' && user.university === currentUser.name
      );
      
      // Get applications from university students
      const studentIds = universityStudents.map(student => student.id);
      const studentApplications = mockApplications.filter(app => 
        studentIds.includes(app.student)
      );
      
      // Enrich applications with internship and organization data
      const enrichedApplications = studentApplications.map(app => {
        const internship = mockInternships.find(int => int.id === app.internship);
        const organization = mockUsers.find(org => org.id === internship?.organizationId);
        const student = universityStudents.find(std => std.id === app.student);
        
        return {
          ...app,
          internship_details: internship,
          organization_details: organization,
          student_details: student
        };
      });

      setStudents(universityStudents);
      setApplications(enrichedApplications);
      setSupervisors(mockSupervisors.filter(sup => sup.university === currentUser.name));
    } catch (err) {
      console.error('Error fetching university data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmApplication = (application) => {
    setSelectedApplication(application);
    setConfirmationData({
      supervisor: '',
      startDate: application.preferred_start_date || '',
      endDate: '',
      requirements: 'Student must submit weekly reports, complete a final project presentation, and maintain regular communication with the university supervisor.',
      objectives: 'Gain practical experience in the field, develop professional skills, and complete a research project related to the internship area.'
    });
    setShowConfirmModal(true);
  };

  const handleAssignSupervisor = (application) => {
    setSelectedApplication(application);
    setConfirmationData({ ...confirmationData, supervisor: '' });
    setShowSupervisorModal(true);
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const submitConfirmation = async () => {
    try {
      // Calculate end date based on internship duration
      const startDate = new Date(confirmationData.startDate);
      let endDate = new Date(startDate);
      
      const duration = selectedApplication.internship_details?.duration;
      switch (duration) {
        case '1_month':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case '2_months':
          endDate.setMonth(endDate.getMonth() + 2);
          break;
        case '3_months':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case '4_months':
          endDate.setMonth(endDate.getMonth() + 4);
          break;
        case '5_months':
          endDate.setMonth(endDate.getMonth() + 5);
          break;
        case '6_months':
          endDate.setMonth(endDate.getMonth() + 6);
          break;
        default:
          endDate.setMonth(endDate.getMonth() + 3);
      }

      const updatedApplication = {
        ...selectedApplication,
        university_confirmation: {
          confirmed_at: new Date().toISOString(),
          confirmed_by: currentUser.name,
          supervisor: confirmationData.supervisor,
          start_date: confirmationData.startDate,
          end_date: endDate.toISOString().split('T')[0],
          requirements: confirmationData.requirements,
          objectives: confirmationData.objectives,
          status: 'confirmed'
        }
      };

      // Update applications list
      setApplications(prev => 
        prev.map(app => 
          app.id === selectedApplication.id ? updatedApplication : app
        )
      );

      // Generate confirmation letter
      generateConfirmationLetter(updatedApplication);
      
      setShowConfirmModal(false);
      setSelectedApplication(null);
      setConfirmationData({
        supervisor: '',
        startDate: '',
        endDate: '',
        requirements: '',
        objectives: ''
      });
    } catch (err) {
      console.error('Error confirming application:', err);
    }
  };

  const assignSupervisor = async () => {
    try {
      const supervisor = supervisors.find(sup => sup.id === confirmationData.supervisor);
      
      const updatedApplication = {
        ...selectedApplication,
        supervisor_assigned: {
          supervisor_id: supervisor.id,
          supervisor_name: supervisor.name,
          supervisor_email: supervisor.email,
          supervisor_department: supervisor.department,
          assigned_at: new Date().toISOString(),
          assigned_by: currentUser.name
        }
      };

      setApplications(prev => 
        prev.map(app => 
          app.id === selectedApplication.id ? updatedApplication : app
        )
      );

      setShowSupervisorModal(false);
      setSelectedApplication(null);
      setConfirmationData({ ...confirmationData, supervisor: '' });
    } catch (err) {
      console.error('Error assigning supervisor:', err);
    }
  };

  const generateConfirmationLetter = (application) => {
    const supervisor = supervisors.find(s => s.id === confirmationData.supervisor);
    const letterContent = `
UNIVERSITY INTERNSHIP CONFIRMATION LETTER

${currentUser.name}
${currentUser.location}
Date: ${new Date().toLocaleDateString()}

TO WHOM IT MAY CONCERN:

This letter serves to confirm that ${application.student_details?.name} (Student ID: ${application.student_details?.studentId || 'N/A'}) is a registered student at ${currentUser.name} in the ${application.student_details?.fieldOfStudy || 'N/A'} program, Year ${application.student_details?.yearOfStudy || 'N/A'}.

INTERNSHIP DETAILS:
- Organization: ${application.organization_details?.name}
- Position: ${application.internship_details?.title}
- Duration: ${confirmationData.startDate} to ${application.university_confirmation?.end_date}
- University Supervisor: ${supervisor?.name}
- Department: ${supervisor?.department}
- Supervisor Email: ${supervisor?.email}

ACADEMIC REQUIREMENTS:
${confirmationData.requirements}

LEARNING OBJECTIVES:
${confirmationData.objectives}

This internship is part of the student's academic requirements and is officially recognized by the university. The student is expected to maintain professional conduct and fulfill all internship obligations as outlined by both the university and the host organization.

We appreciate your cooperation in providing this valuable learning opportunity to our student.

For any inquiries regarding this internship or the student's academic standing, please contact the Academic Affairs Office.

Sincerely,

Academic Affairs Office
${currentUser.name}

Contact Information:
Email: ${currentUser.email}
Phone: +255 123 456 789
Website: ${currentUser.website}

This letter is valid for the duration of the internship period specified above.
    `;

    // Create and download the letter
    const blob = new Blob([letterContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Internship_Confirmation_Letter_${application.student_details?.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadConfirmationLetter = (application) => {
    if (application.university_confirmation) {
      generateConfirmationLetter(application);
    }
  };

  // Calculate statistics
  const totalApplications = applications.length;
  const confirmedApplications = applications.filter(app => app.university_confirmation?.status === 'confirmed').length;
  const pendingApplications = applications.filter(app => !app.university_confirmation && app.status === 'accepted').length;
  const supervisorsAssigned = applications.filter(app => app.supervisor_assigned).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">University Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser.name}</p>
          <p className="text-sm text-gray-500">Manage student internship applications and confirmations</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/university/students" className="btn-secondary">
            <FaUsers className="mr-2" />
            Manage Students
          </Link>
          <Link to="/university/supervisors" className="btn-outline">
            <FaUserTie className="mr-2" />
            Supervisors
          </Link>
          <Link to="/university/profile" className="btn-primary">
            View Profile
          </Link>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Registered Students" 
          value={students.length} 
          icon={<FaGraduationCap className="h-6 w-6" />}
          color="primary"
          subtitle={`From ${currentUser.name}`}
        />
        <StatCard 
          title="Student Applications" 
          value={totalApplications} 
          icon={<FaFileAlt className="h-6 w-6" />}
          color="secondary"
          subtitle={`${pendingApplications} need confirmation`}
        />
        <StatCard 
          title="Confirmed Internships" 
          value={confirmedApplications} 
          icon={<FaCheckCircle className="h-6 w-6" />}
          color="success"
          subtitle="University approved"
        />
        <StatCard 
          title="Supervisors Assigned" 
          value={supervisorsAssigned} 
          icon={<FaUserTie className="h-6 w-6" />}
          color="accent"
          subtitle={`${supervisors.length} available`}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-primary-200"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                <FaExclamationTriangle className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{pendingApplications} Pending</h3>
                <p className="text-sm text-gray-600">Applications need confirmation</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-secondary-200"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center mr-3">
                <FaUserCheck className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{confirmedApplications - supervisorsAssigned}</h3>
                <p className="text-sm text-gray-600">Need supervisor assignment</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-accent-200"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
                <FaChartLine className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{Math.round((confirmedApplications / Math.max(totalApplications, 1)) * 100)}%</h3>
                <p className="text-sm text-gray-600">Confirmation rate</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Student Applications Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Student Internship Applications</h2>
            <p className="text-sm text-gray-600 mt-1">
              Review and confirm student internship applications from {currentUser.name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{pendingApplications}</span> pending confirmations
            </div>
            <select className="input text-sm">
              <option value="all">All Applications</option>
              <option value="pending">Pending Confirmation</option>
              <option value="confirmed">Confirmed</option>
              <option value="need_supervisor">Need Supervisor</option>
            </select>
          </div>
        </div>
        
        {applications.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applications.map((application) => (
              <StudentApplicationCard
                key={application.id}
                application={application}
                onConfirm={handleConfirmApplication}
                onAssignSupervisor={handleAssignSupervisor}
                onViewDetails={handleViewDetails}
                onDownloadLetter={downloadConfirmationLetter}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaFileAlt className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Student applications will appear here when they apply for internships
            </p>
            <div className="mt-6">
              <Link to="/university/students" className="btn-primary">
                View Students
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Confirm Internship Application</h2>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Application Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Student:</span> {selectedApplication.student_details?.name}
                </div>
                <div>
                  <span className="font-medium">Program:</span> {selectedApplication.student_details?.fieldOfStudy}
                </div>
                <div>
                  <span className="font-medium">Organization:</span> {selectedApplication.organization_details?.name}
                </div>
                <div>
                  <span className="font-medium">Position:</span> {selectedApplication.internship_details?.title}
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Supervisor *</label>
                  <select
                    value={confirmationData.supervisor}
                    onChange={(e) => setConfirmationData({...confirmationData, supervisor: e.target.value})}
                    className="input"
                    required
                  >
                    <option value="">Select Supervisor</option>
                    {supervisors.map(supervisor => (
                      <option key={supervisor.id} value={supervisor.id}>
                        {supervisor.name} - {supervisor.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Duration</label>
                  <input
                    type="text"
                    value={selectedApplication.internship_details?.duration?.replace('_', ' ') || ''}
                    className="input bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <label className="label">Start Date *</label>
                  <input
                    type="date"
                    value={confirmationData.startDate}
                    onChange={(e) => setConfirmationData({...confirmationData, startDate: e.target.value})}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">End Date (Auto-calculated)</label>
                  <input
                    type="text"
                    value={confirmationData.startDate ? (() => {
                      const startDate = new Date(confirmationData.startDate);
                      let endDate = new Date(startDate);
                      const duration = selectedApplication.internship_details?.duration;
                      switch (duration) {
                        case '1_month': endDate.setMonth(endDate.getMonth() + 1); break;
                        case '2_months': endDate.setMonth(endDate.getMonth() + 2); break;
                        case '3_months': endDate.setMonth(endDate.getMonth() + 3); break;
                        case '4_months': endDate.setMonth(endDate.getMonth() + 4); break;
                        case '5_months': endDate.setMonth(endDate.getMonth() + 5); break;
                        case '6_months': endDate.setMonth(endDate.getMonth() + 6); break;
                        default: endDate.setMonth(endDate.getMonth() + 3);
                      }
                      return endDate.toISOString().split('T')[0];
                    })() : ''}
                    className="input bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="label">Academic Requirements</label>
                <textarea
                  value={confirmationData.requirements}
                  onChange={(e) => setConfirmationData({...confirmationData, requirements: e.target.value})}
                  rows="3"
                  className="input"
                  placeholder="Specify any academic requirements, reporting expectations, etc."
                />
              </div>

              <div>
                <label className="label">Learning Objectives</label>
                <textarea
                  value={confirmationData.objectives}
                  onChange={(e) => setConfirmationData({...confirmationData, objectives: e.target.value})}
                  rows="3"
                  className="input"
                  placeholder="Define the learning objectives for this internship"
                />
              </div>
            </form>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedApplication(null);
                  setConfirmationData({
                    supervisor: '',
                    startDate: '',
                    endDate: '',
                    requirements: '',
                    objectives: ''
                  });
                }}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={submitConfirmation}
                className="btn-primary"
                disabled={!confirmationData.supervisor || !confirmationData.startDate}
              >
                Confirm & Generate Letter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supervisor Assignment Modal */}
      {showSupervisorModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Assign Supervisor</h2>
              <button
                onClick={() => setShowSupervisorModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Student Information</h3>
              <p><span className="font-medium">Name:</span> {selectedApplication.student_details?.name}</p>
              <p><span className="font-medium">Program:</span> {selectedApplication.student_details?.fieldOfStudy}</p>
              <p><span className="font-medium">Internship:</span> {selectedApplication.internship_details?.title}</p>
            </div>

            <div className="mb-4">
              <label className="label">Select Supervisor *</label>
              <select
                value={confirmationData.supervisor}
                onChange={(e) => setConfirmationData({...confirmationData, supervisor: e.target.value})}
                className="input"
                required
              >
                <option value="">Choose a supervisor</option>
                {supervisors.map(supervisor => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.name} - {supervisor.department}
                  </option>
                ))}
              </select>
            </div>

            {confirmationData.supervisor && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                {(() => {
                  const supervisor = supervisors.find(s => s.id === confirmationData.supervisor);
                  return supervisor ? (
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Supervisor Details</h4>
                      <p className="text-sm"><span className="font-medium">Email:</span> {supervisor.email}</p>
                      <p className="text-sm"><span className="font-medium">Department:</span> {supervisor.department}</p>
                      <p className="text-sm"><span className="font-medium">Specialization:</span> {supervisor.specialization}</p>
                      <p className="text-sm"><span className="font-medium">Office:</span> {supervisor.office}</p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSupervisorModal(false);
                  setSelectedApplication(null);
                  setConfirmationData({...confirmationData, supervisor: ''});
                }}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={assignSupervisor}
                className="btn-primary"
                disabled={!confirmationData.supervisor}
              >
                Assign Supervisor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Application Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Student Information</h3>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedApplication.student_details?.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedApplication.student_details?.email}</p>
                  <p><span className="font-medium">Student ID:</span> {selectedApplication.student_details?.studentId}</p>
                  <p><span className="font-medium">Program:</span> {selectedApplication.student_details?.fieldOfStudy}</p>
                  <p><span className="font-medium">Year:</span> {selectedApplication.student_details?.yearOfStudy}</p>
                  <p><span className="font-medium">University:</span> {selectedApplication.student_details?.university}</p>
                  <p><span className="font-medium">Phone:</span> {selectedApplication.student_details?.phone}</p>
                </div>

                {/* Skills */}
                {selectedApplication.student_details?.skills && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.student_details.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Internship Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Internship Information</h3>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <p><span className="font-medium">Position:</span> {selectedApplication.internship_details?.title}</p>
                  <p><span className="font-medium">Organization:</span> {selectedApplication.organization_details?.name}</p>
                  <p><span className="font-medium">Duration:</span> {selectedApplication.internship_details?.duration?.replace('_', ' ')}</p>
                  <p><span className="font-medium">Location:</span> {selectedApplication.internship_details?.location}</p>
                  <p><span className="font-medium">Remote:</span> {selectedApplication.internship_details?.is_remote ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Stipend:</span> {selectedApplication.internship_details?.stipend_amount ? `TZS ${parseInt(selectedApplication.internship_details.stipend_amount).toLocaleString()}` : 'Not specified'}</p>
                </div>

                {/* Application Details */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Application Status</h4>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <p><span className="font-medium">Applied:</span> {new Date(selectedApplication.applied_at).toLocaleDateString()}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        selectedApplication.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        selectedApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                      </span>
                    </p>
                    <p><span className="font-medium">Availability:</span> {selectedApplication.availability}</p>
                    <p><span className="font-medium">Preferred Start:</span> {selectedApplication.preferred_start_date}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Cover Letter</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{selectedApplication.cover_letter}</p>
              </div>
            </div>

            {/* University Confirmation Status */}
            {selectedApplication.university_confirmation && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">University Confirmation</h3>
                <div className="p-4 bg-green-50 rounded-lg space-y-2">
                  <p><span className="font-medium">Confirmed by:</span> {selectedApplication.university_confirmation.confirmed_by}</p>
                  <p><span className="font-medium">Confirmed on:</span> {new Date(selectedApplication.university_confirmation.confirmed_at).toLocaleDateString()}</p>
                  <p><span className="font-medium">Start Date:</span> {selectedApplication.university_confirmation.start_date}</p>
                  <p><span className="font-medium">End Date:</span> {selectedApplication.university_confirmation.end_date}</p>
                  {selectedApplication.university_confirmation.requirements && (
                    <p><span className="font-medium">Requirements:</span> {selectedApplication.university_confirmation.requirements}</p>
                  )}
                  {selectedApplication.university_confirmation.objectives && (
                    <p><span className="font-medium">Objectives:</span> {selectedApplication.university_confirmation.objectives}</p>
                  )}
                </div>
              </div>
            )}

            {/* Supervisor Assignment */}
            {selectedApplication.supervisor_assigned && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Assigned Supervisor</h3>
                <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedApplication.supervisor_assigned.supervisor_name}</p>
                  <p><span className="font-medium">Email:</span> {selectedApplication.supervisor_assigned.supervisor_email}</p>
                  <p><span className="font-medium">Department:</span> {selectedApplication.supervisor_assigned.supervisor_department}</p>
                  <p><span className="font-medium">Assigned on:</span> {new Date(selectedApplication.supervisor_assigned.assigned_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityDashboard;