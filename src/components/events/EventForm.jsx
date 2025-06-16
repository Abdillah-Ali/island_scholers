import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTimes } from 'react-icons/fa';

const EventForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'Hackathon',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    location: initialData?.location || '',
    isVirtual: initialData?.isVirtual || false,
    maxParticipants: initialData?.maxParticipants || '',
    registrationDeadline: initialData?.registrationDeadline || '',
    requirements: initialData?.requirements || '',
    prizes: initialData?.prizes?.join('\n') || '',
    tags: initialData?.tags?.join(', ') || ''
  });

  const [errors, setErrors] = useState({});

  const eventTypes = [
    'Hackathon',
    'Career Fair',
    'Workshop',
    'Competition',
    'Networking Event',
    'Conference',
    'Seminar',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.maxParticipants || formData.maxParticipants < 1) {
      newErrors.maxParticipants = 'Valid participant limit is required';
    }
    if (!formData.registrationDeadline) {
      newErrors.registrationDeadline = 'Registration deadline is required';
    }

    // Date validations
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.registrationDeadline && formData.startDate) {
      if (new Date(formData.registrationDeadline) >= new Date(formData.startDate)) {
        newErrors.registrationDeadline = 'Registration deadline must be before start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const eventData = {
      ...formData,
      maxParticipants: parseInt(formData.maxParticipants),
      prizes: formData.prizes ? formData.prizes.split('\n').filter(p => p.trim()) : [],
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
    };

    onSubmit(eventData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {initialData ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="label">Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Enter event title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`input ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your event"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Type and Virtual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Event Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input"
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVirtual"
                  name="isVirtual"
                  checked={formData.isVirtual}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isVirtual" className="ml-2 text-sm text-gray-700">
                  Virtual Event
                </label>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`input ${errors.startDate ? 'border-red-500' : ''}`}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="label">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`input ${errors.endDate ? 'border-red-500' : ''}`}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>

            {/* Location and Participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`input ${errors.location ? 'border-red-500' : ''}`}
                  placeholder={formData.isVirtual ? "Online platform" : "Physical address"}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
              <div>
                <label className="label">Max Participants *</label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  min="1"
                  className={`input ${errors.maxParticipants ? 'border-red-500' : ''}`}
                  placeholder="100"
                />
                {errors.maxParticipants && <p className="text-red-500 text-sm mt-1">{errors.maxParticipants}</p>}
              </div>
            </div>

            {/* Registration Deadline */}
            <div>
              <label className="label">Registration Deadline *</label>
              <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className={`input ${errors.registrationDeadline ? 'border-red-500' : ''}`}
              />
              {errors.registrationDeadline && <p className="text-red-500 text-sm mt-1">{errors.registrationDeadline}</p>}
            </div>

            {/* Requirements */}
            <div>
              <label className="label">Requirements</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="3"
                className="input"
                placeholder="Any specific requirements for participants"
              />
            </div>

            {/* Prizes */}
            <div>
              <label className="label">Prizes (one per line)</label>
              <textarea
                name="prizes"
                value={formData.prizes}
                onChange={handleChange}
                rows="3"
                className="input"
                placeholder="$5,000 First Prize&#10;$3,000 Second Prize&#10;$1,000 Third Prize"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="label">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input"
                placeholder="Technology, Innovation, Programming"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {initialData ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventForm;