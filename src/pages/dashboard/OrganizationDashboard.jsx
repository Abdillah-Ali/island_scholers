import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBuilding, FaUser, FaFileAlt, FaListAlt, FaUniversity, FaUsers, FaCalendarPlus, FaCalendarAlt, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import EventForm from '../../components/events/EventForm';
import EventCard from '../../components/events/EventCard';

const OrganizationDashboard = () => {
  const { currentUser } = useAuth();
  const [orgInternships, setOrgInternships] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [orgEvents, setOrgEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, [currentUser.id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, these would be API calls to your Django backend
      // const [internshipsRes, applicationsRes, eventsRes] = await Promise.all([
      //   fetch('/api/internships/my-internships/'),
      //   fetch('/api/applications/received/'),
      //   fetch('/api/events/my-events/')
      // ]);
      
      // For now, we'll use empty arrays
      setOrgInternships([]);
      setRecentApplications([]);
      setOrgEvents([]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Count stats
  const totalInternships = orgInternships.length;
  const activeInternships = orgInternships.filter(i => i.is_active).length;
  const totalApplications = recentApplications.length;
  const totalEvents = orgEvents.length;
  
  const handleCreateEvent = async (eventData) => {
    try {
      const newEvent = {
        id: `event-${Date.now()}`,
        organization: currentUser.id,
        ...eventData,
        currentParticipants: 0,
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      setOrgEvents(prev => [newEvent, ...prev]);
      setShowEventForm(false);
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };
  
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };
  
  const handleUpdateEvent = async (eventData) => {
    try {
      const updatedEvent = {
        ...editingEvent,
        ...eventData
      };
      
      setOrgEvents(prev => 
        prev.map(event => 
          event.id === editingEvent.id ? updatedEvent : event
        )
      );
      setShowEventForm(false);
      setEditingEvent(null);
    } catch (err) {
      console.error('Error updating event:', err);
    }
  };
  
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setOrgEvents(prev => prev.filter(event => event.id !== eventId));
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };
  
  const handleCancelEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleCreateInternship = () => {
    // For demo purposes, add a new internship
    const newInternship = {
      id: `int-${Date.now()}`,
      title: 'New Internship Position',
      description: 'This is a newly created internship position.',
      is_active: true,
      created_at: new Date().toISOString(),
      applications_count: 0,
      skills_required: ['Communication', 'Teamwork'],
      location: 'Dar es Salaam',
      duration: '3_months',
      stipend_amount: '500000'
    };
    
    setOrgInternships(prev => [newInternship, ...prev]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Organization Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser.name}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowEventForm(true)}
            className="btn-secondary flex items-center"
          >
            <FaCalendarPlus className="mr-2" />
            Create Event
          </button>
          <button
            onClick={handleCreateInternship}
            className="btn-primary flex items-center"
          >
            <FaPlus className="mr-2" />
            Post New Internship
          </button>
          <Link to="/organization/profile" className="btn-outline">
            View Profile
          </Link>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Internships" 
          value={totalInternships} 
          icon={<FaListAlt className="h-6 w-6" />}
          color="primary"
        />
        <StatCard 
          title="Active Positions" 
          value={activeInternships} 
          icon={<FaFileAlt className="h-6 w-6" />}
          color="secondary"
        />
        <StatCard 
          title="Total Applications" 
          value={totalApplications} 
          icon={<FaUsers className="h-6 w-6" />}
          color="accent"
        />
        <StatCard 
          title="Events Created" 
          value={totalEvents} 
          icon={<FaCalendarAlt className="h-6 w-6" />}
          color="success"
        />
      </div>
      
      {/* Events Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Events</h2>
          <button
            onClick={() => setShowEventForm(true)}
            className="btn-primary flex items-center"
          >
            <FaCalendarPlus className="mr-2" />
            Create Event
          </button>
        </div>
        
        {orgEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orgEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first event to engage with students
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowEventForm(true)}
                className="btn-primary"
              >
                Create Event
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Internship listings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Your Internships</h2>
              <button
                onClick={handleCreateInternship}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
              >
                <FaPlus className="mr-1" />
                Add New
              </button>
            </div>
            
            {orgInternships.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {orgInternships.slice(0, 5).map(internship => (
                  <div key={internship.id} className="py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{internship.title}</h3>
                        <p className="text-sm text-gray-600">
                          Posted on {new Date(internship.created_at).toLocaleDateString()} • 
                          {internship.applications_count || 0} application(s)
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          internship.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {internship.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 truncate max-w-xl">
                        {internship.description?.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {internship.skills_required?.slice(0, 3).map(skill => (
                        <span key={skill} className="inline-block bg-secondary-100 text-secondary-800 text-xs px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                      {internship.skills_required?.length > 3 && (
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                          +{internship.skills_required.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {internship.location} • 
                        <span className="font-medium ml-2">Duration:</span> {internship.duration?.replace('_', ' ')} •
                        <span className="font-medium ml-2">Stipend:</span> TZS {parseInt(internship.stipend_amount || 0).toLocaleString()}
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                          <FaEye className="mr-1" />
                          View
                        </button>
                        <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                          <FaEdit className="mr-1" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaBuilding className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No internships yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Post your first internship opportunity
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCreateInternship}
                    className="btn-primary"
                  >
                    Post Internship
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Applications</h2>
            
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.slice(0, 5).map(application => (
                  <motion.div 
                    key={application.id}
                    whileHover={{ x: 5 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FaUser className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {application.student_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Applied for {application.internship_title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(application.applied_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        application.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : application.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : application.status === 'under_review'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button className="text-xs text-primary-600 hover:text-primary-700">
                        Review
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No applications yet</p>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
            
            <div className="space-y-3">
              <button 
                onClick={handleCreateInternship}
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center">
                  <FaFileAlt className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-800">Post New Internship</span>
                </div>
              </button>
              
              <button 
                onClick={() => setShowEventForm(true)}
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-secondary-300 hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center">
                  <FaCalendarPlus className="w-5 h-5 text-secondary-600 mr-3" />
                  <span className="font-medium text-gray-800">Create Event</span>
                </div>
              </button>
              
              <Link 
                to="/organization/applications"
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-accent-300 hover:bg-accent-50 transition-colors"
              >
                <div className="flex items-center">
                  <FaUsers className="w-5 h-5 text-accent-600 mr-3" />
                  <span className="font-medium text-gray-800">Review Applications</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      <AnimatePresence>
        {showEventForm && (
          <EventForm
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            onCancel={handleCancelEventForm}
            initialData={editingEvent}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganizationDashboard;