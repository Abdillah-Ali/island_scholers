import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFileUpload, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { mockInternships } from '../../data/mockData';

const InternshipApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    coverLetter: '',
    resume: null,
    portfolio: '',
    availability: '',
    startDate: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Find the internship details
  const internship = mockInternships.find(i => i.id === id);
  
  if (!internship) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Internship not found</h2>
        <button 
          onClick={() => navigate('/student/internships')}
          className="mt-4 btn-primary"
        >
          Back to Internships
        </button>
      </div>
    );
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.coverLetter || !formData.resume || !formData.startDate) {
      setError('Please fill in all required fields');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would send this to an API
      const application = {
        internshipId: id,
        studentId: currentUser.id,
        coverLetter: formData.coverLetter,
        resumePath: formData.resume.name,
        portfolio: formData.portfolio,
        availability: formData.availability,
        startDate: formData.startDate,
        status: 'pending',
        appliedDate: new Date().toISOString()
      };
      
      // Navigate back to dashboard with success message
      navigate('/student/dashboard', { 
        state: { 
          message: 'Application submitted successfully!',
          type: 'success'
        }
      });
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      setLoading(false);
    }
  };
  
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
          <p className="text-gray-600 mb-6">{internship.description}</p>
          
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
                className="input"
                placeholder="Explain why you're interested in this position and what makes you a great candidate..."
                required
              />
            </div>
            
            {/* Resume Upload */}
            <div>
              <label htmlFor="resume" className="label">
                Resume <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="resume"
                        name="resume"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
              </div>
            </div>
            
            {/* Portfolio URL */}
            <div>
              <label htmlFor="portfolio" className="label">
                Portfolio URL (optional)
              </label>
              <input
                type="url"
                id="portfolio"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                className="input"
                placeholder="https://your-portfolio.com"
              />
            </div>
            
            {/* Availability */}
            <div>
              <label htmlFor="availability" className="label">
                Availability
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select availability</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="label">
                Preferred Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input"
                required
              />
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
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default InternshipApplication;