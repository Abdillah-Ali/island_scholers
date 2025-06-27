import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFileUpload, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { internshipsApi, applicationsApi } from '../../services/api';
import { useApi } from '../../hooks/useApi';

const InternshipApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [internship, setInternship] = useState(null);
  
  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeUrl: '',
    portfolioUrl: '',
    availability: '',
    preferredStartDate: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const { loading, error, execute } = useApi();
  
  useEffect(() => {
    if (id) {
      fetchInternshipDetails();
    }
  }, [id]);

  const fetchInternshipDetails = async () => {
    await execute(
      () => internshipsApi.getById(id),
      {
        onSuccess: (data) => {
          setInternship(data);
        },
        onError: (err) => {
          console.error('Failed to fetch internship details:', err);
        }
      }
    );
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.coverLetter.trim()) {
      errors.coverLetter = 'Cover letter is required';
    } else if (formData.coverLetter.trim().length < 50) {
      errors.coverLetter = 'Cover letter must be at least 50 characters long';
    }
    
    if (!formData.preferredStartDate) {
      errors.preferredStartDate = 'Preferred start date is required';
    } else {
      const startDate = new Date(formData.preferredStartDate);
      const today = new Date();
      if (startDate < today) {
        errors.preferredStartDate = 'Start date cannot be in the past';
      }
    }
    
    if (!formData.availability) {
      errors.availability = 'Please specify your availability';
    }
    
    // Validate URLs if provided
    if (formData.portfolioUrl && !isValidUrl(formData.portfolioUrl)) {
      errors.portfolioUrl = 'Please enter a valid URL';
    }
    
    if (formData.resumeUrl && !isValidUrl(formData.resumeUrl)) {
      errors.resumeUrl = 'Please enter a valid URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const applicationData = {
      internship: { id: parseInt(id) },
      coverLetter: formData.coverLetter.trim(),
      resumeUrl: formData.resumeUrl.trim() || null,
      portfolioUrl: formData.portfolioUrl.trim() || null,
      availability: formData.availability,
      preferredStartDate: formData.preferredStartDate
    };
    
    await execute(
      () => applicationsApi.create(applicationData),
      {
        onSuccess: () => {
          setSubmitSuccess(true);
          setTimeout(() => {
            navigate('/student/dashboard', { 
              state: { 
                message: 'Application submitted successfully!',
                type: 'success'
              }
            });
          }, 2000);
        },
        onError: (err) => {
          console.error('Failed to submit application:', err);
        }
      }
    );
  };

  if (loading && !internship) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error && !internship) {
    return (
      <div className="text-center py-12">
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center justify-center rounded-md max-w-md mx-auto">
          <FaExclamationCircle className="mr-3" />
          <div>
            <p className="font-medium">Error loading internship</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/internships')}
          className="mt-4 btn-primary"
        >
          Back to Internships
        </button>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Internship not found</h2>
        <button 
          onClick={() => navigate('/internships')}
          className="mt-4 btn-primary"
        >
          Back to Internships
        </button>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your application for {internship.title} has been successfully submitted. 
            You will be redirected to your dashboard shortly.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Apply for {internship.title}
          </h1>
          <p className="text-gray-600 mb-6">{internship.description?.substring(0, 200)}...</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
              <FaExclamationCircle className="mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Letter */}
            <div>
              <label htmlFor="coverLetter" className="label">
                Cover Letter <span className="text-red-500">*</span>
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                rows="6"
                className={`input ${formErrors.coverLetter ? 'border-red-500' : ''}`}
                placeholder="Explain why you're interested in this position and what makes you a great candidate..."
                required
              />
              {formErrors.coverLetter && (
                <p className="text-red-500 text-sm mt-1">{formErrors.coverLetter}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {formData.coverLetter.length}/2000 characters (minimum 50)
              </p>
            </div>
            
            {/* Resume URL */}
            <div>
              <label htmlFor="resumeUrl" className="label">
                Resume URL
              </label>
              <input
                type="url"
                id="resumeUrl"
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleChange}
                className={`input ${formErrors.resumeUrl ? 'border-red-500' : ''}`}
                placeholder="https://drive.google.com/file/d/your-resume-link"
              />
              {formErrors.resumeUrl && (
                <p className="text-red-500 text-sm mt-1">{formErrors.resumeUrl}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Link to your resume (Google Drive, Dropbox, etc.)
              </p>
            </div>
            
            {/* Portfolio URL */}
            <div>
              <label htmlFor="portfolioUrl" className="label">
                Portfolio URL (optional)
              </label>
              <input
                type="url"
                id="portfolioUrl"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                className={`input ${formErrors.portfolioUrl ? 'border-red-500' : ''}`}
                placeholder="https://your-portfolio.com"
              />
              {formErrors.portfolioUrl && (
                <p className="text-red-500 text-sm mt-1">{formErrors.portfolioUrl}</p>
              )}
            </div>
            
            {/* Availability */}
            <div>
              <label htmlFor="availability" className="label">
                Availability <span className="text-red-500">*</span>
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className={`input ${formErrors.availability ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Select availability</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Flexible">Flexible</option>
                <option value="Weekends only">Weekends only</option>
              </select>
              {formErrors.availability && (
                <p className="text-red-500 text-sm mt-1">{formErrors.availability}</p>
              )}
            </div>
            
            {/* Start Date */}
            <div>
              <label htmlFor="preferredStartDate" className="label">
                Preferred Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="preferredStartDate"
                name="preferredStartDate"
                value={formData.preferredStartDate}
                onChange={handleChange}
                className={`input ${formErrors.preferredStartDate ? 'border-red-500' : ''}`}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              {formErrors.preferredStartDate && (
                <p className="text-red-500 text-sm mt-1">{formErrors.preferredStartDate}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default InternshipApplication;