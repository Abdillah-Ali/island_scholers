import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaEdit, FaTrash, FaTrophy, FaGlobe } from 'react-icons/fa';

const EventCard = ({ event, onEdit, onDelete, showActions = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEventIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'hackathon':
        return <FaTrophy className="w-5 h-5" />;
      case 'career fair':
        return <FaUsers className="w-5 h-5" />;
      case 'workshop':
        return <FaCalendarAlt className="w-5 h-5" />;
      default:
        return <FaCalendarAlt className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isRegistrationOpen = () => {
    const deadline = new Date(event.registrationDeadline);
    const now = new Date();
    return deadline > now && event.status === 'active';
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
            {getEventIcon(event.type)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
        </div>
        
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(event)}
              className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <FaCalendarAlt className="w-4 h-4 mr-2" />
          <span>
            {formatDate(event.startDate)}
            {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600">
          {event.isVirtual ? (
            <>
              <FaGlobe className="w-4 h-4 mr-2" />
              <span>Virtual Event</span>
            </>
          ) : (
            <>
              <FaMapMarkerAlt className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center text-gray-600">
          <FaUsers className="w-4 h-4 mr-2" />
          <span>
            {event.currentParticipants || 0} / {event.maxParticipants} participants
          </span>
        </div>
      </div>

      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {event.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Type: {event.type}
        </span>
        
        {!showActions && (
          <div className="flex space-x-2">
            {isRegistrationOpen() ? (
              <button className="btn-primary text-sm">
                Register Now
              </button>
            ) : (
              <span className="text-sm text-gray-500">
                Registration Closed
              </span>
            )}
          </div>
        )}
      </div>

      {event.prizes && event.prizes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Prizes:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {event.prizes.slice(0, 3).map((prize, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                {prize}
              </li>
            ))}
            {event.prizes.length > 3 && (
              <li className="text-gray-500">+{event.prizes.length - 3} more</li>
            )}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default EventCard;