import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaBuilding,
  FaMapMarkerAlt,
  FaUsers,
  FaCheck,
  FaBan,
  FaTimes,
  FaGlobe
} from 'react-icons/fa';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, statusFilter, typeFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app this would come from your Django backend
      setEvents([]);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.event_type === typeFilter);
    }

    setFilteredEvents(filtered);
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmDeleteEvent = async () => {
    try {
      // In a real app, this would be an API call
      setEvents(prev => prev.filter(event => event.id !== eventToDelete.id));
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const toggleEventStatus = async (eventId, currentStatus) => {
    try {
      // In a real app, this would be an API call
      const newStatus = currentStatus === 'active' ? 'cancelled' : 'active';
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, status: newStatus }
          : event
      ));
    } catch (err) {
      console.error('Error updating event status:', err);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'hackathon':
        return 'bg-purple-100 text-purple-800';
      case 'career_fair':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'competition':
        return 'bg-orange-100 text-orange-800';
      case 'networking':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Event Management</h1>
          <p className="text-gray-600">Monitor and manage all platform events</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Types</option>
              <option value="hackathon">Hackathon</option>
              <option value="career_fair">Career Fair</option>
              <option value="workshop">Workshop</option>
              <option value="competition">Competition</option>
              <option value="networking">Networking</option>
              <option value="conference">Conference</option>
              <option value="seminar">Seminar</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Events ({filteredEvents.length})
          </h2>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          {event.is_virtual ? (
                            <>
                              <FaGlobe className="w-3 h-3 mr-1" />
                              Virtual
                            </>
                          ) : (
                            <>
                              <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                              {event.location}
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaBuilding className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {event.organization_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.event_type)}`}>
                        {event.event_type?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(event.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <FaUsers className="w-3 h-3 text-gray-400 mr-1" />
                        {event.current_participants || 0} / {event.max_participants}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleEventStatus(event.id, event.status)}
                          className={`${event.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          title={event.status === 'active' ? 'Cancel Event' : 'Activate Event'}
                        >
                          {event.status === 'active' ? <FaBan className="w-4 h-4" /> : <FaCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Event"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search filters'
                : 'Events will appear here once organizations create them'
              }
            </p>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Event Details</h2>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedEvent.title}</h3>
                  <p className="text-gray-600">{selectedEvent.organization_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(selectedEvent.event_type)}`}>
                      {selectedEvent.event_type?.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedEvent.status)}`}>
                      {selectedEvent.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedEvent.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedEvent.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedEvent.is_virtual ? 'Virtual Event' : selectedEvent.location}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Participants</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedEvent.current_participants || 0} / {selectedEvent.max_participants}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Deadline</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedEvent.registration_deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedEvent.description}</p>
                </div>

                {selectedEvent.requirements && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Requirements</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEvent.requirements}</p>
                  </div>
                )}

                {selectedEvent.prizes && selectedEvent.prizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prizes</label>
                    <ul className="mt-1 text-sm text-gray-900 space-y-1">
                      {selectedEvent.prizes.map((prize, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                          {prize}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedEvent.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => toggleEventStatus(selectedEvent.id, selectedEvent.status)}
                className={`px-4 py-2 rounded-md ${
                  selectedEvent.status === 'active' 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {selectedEvent.status === 'active' ?  'Cancel Event' : 'Activate Event'}
              </button>
              <button
                onClick={() => setShowEventModal(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && eventToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <FaTrash className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-xl font-bold">Delete Event</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{eventToDelete.title}</strong>? 
              This action cannot be undone and will affect all registered participants.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteEvent}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;