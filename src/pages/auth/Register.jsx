import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, 
  FaLock, 
  FaUser, 
  FaBuilding, 
  FaUniversity, 
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaGlobe,
  FaIndustry,
  FaUsers,
  FaCalendarAlt,
  FaPhone,
  FaIdCard,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaGraduationCap,
  FaBook
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    
    // Student specific
    university: '',
    studentId: '',
    yearOfStudy: '',
    fieldOfStudy: '',
    phone: '',
    
    // Organization specific
    companyName: '',
    industry: '',
    companySize: '',
    description: '',
    website: '',
    foundedYear: '',
    registrationNumber: '',
    location: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    
    // University specific
    establishedYear: '',
    studentCount: '',
    facultyCount: '',
    programs: []
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };
  
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.role) {
          setError('Please select your role');
          return false;
        }
        return true;
      
      case 2:
        // Check specific fields for better error messages
        if (!formData.email) {
          setError('Email address is required');
          return false;
        }
        if (!formData.email.includes('@')) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!formData.password) {
          setError('Password is required');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return false;
        }
        if (!formData.confirmPassword) {
          setError('Please confirm your password');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        
        // Role-specific name validation
        if (formData.role === 'organization') {
          if (!formData.companyName) {
            setError('Organization name is required');
            return false;
          }
        } else {
          if (!formData.name) {
            setError('Name is required');
            return false;
          }
        }
        return true;
      
      case 3:
        if (formData.role === 'student') {
          if (!formData.university) {
            setError('University selection is required');
            return false;
          }
          if (!formData.fieldOfStudy) {
            setError('Field of study is required');
            return false;
          }
        } else if (formData.role === 'organization') {
          if (!formData.industry) {
            setError('Industry selection is required');
            return false;
          }
          if (!formData.description) {
            setError('Company description is required');
            return false;
          }
          if (!formData.location) {
            setError('Company location is required');
            return false;
          }
        } else if (formData.role === 'university') {
          if (!formData.description) {
            setError('University description is required');
            return false;
          }
          if (!formData.location) {
            setError('University location is required');
            return false;
          }
        }
        return true;
      
      default:
        return true;
    }
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setError('');
    setLoading(true);
    
    try {
      const userData = {
        ...formData
      };
      
      const user = await register(userData);
      
      // Redirect based on user role
      switch (user.role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'organization':
          navigate('/organization/dashboard');
          break;
        case 'university':
          navigate('/university/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  const getRoleIcon = (role) => {
    switch (role) {
      case 'student':
        return <FaUser className="h-8 w-8" />;
      case 'organization':
        return <FaBuilding className="h-8 w-8" />;
      case 'university':
        return <FaUniversity className="h-8 w-8" />;
      default:
        return <FaUser className="h-8 w-8" />;
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'student':
        return 'Find internships and build your career';
      case 'organization':
        return 'List internship opportunities and find talent';
      case 'university':
        return 'Connect students with opportunities';
      default:
        return '';
    }
  };

  const industries = [
    'Technology',
    'Telecommunications',
    'Banking & Finance',
    'Aviation',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Agriculture',
    'Tourism',
    'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  const tanzanianUniversities = [
    'State University of Zanzibar',
    'University of Dar es Salaam',
    'Sokoine University of Agriculture',
    'Mzumbe University',
    'Nelson Mandela African Institution of Science and Technology',
    'Muhimbili University of Health and Allied Sciences',
    'Open University of Tanzania',
    'University of Dodoma',
    'Ardhi University',
    'Mbeya University of Science and Technology',
    'St. Augustine University of Tanzania',
    'Tumaini University Makumira',
    'University of Arusha',
    'Zanzibar University',
    'Hubert Kairuki Memorial University',
    'International Medical and Technological University',
    'Kampala International University in Tanzania',
    'Kilimanjaro Christian Medical University College',
    'Marian University College',
    'Mount Meru University',
    'Muslim University of Morogoro',
    'Ruaha Catholic University',
    'Sebastian Kolowa Memorial University',
    'Stefano Moshi Memorial University College',
    'Teofilo Kisanji University',
    'The Institute of Finance Management',
    'University of Bagamoyo',
    'Dar es Salaam Institute of Technology',
    'Institute of Rural Development Planning',
    'College of Business Education',
    'National Institute of Transport',
    'Tengeru Institute of Community Development',
    'Other'
  ];

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-8 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                {formData.role === 'organization' ? 'List Your Organization' : 
                 formData.role === 'university' ? 'Register Your University' : 'Create Account'}
              </h1>
              <p className="text-white text-opacity-90">
                {formData.role === 'organization' 
                  ? 'Join our network of leading organizations in Tanzania'
                  : formData.role === 'university'
                  ? 'Connect your university with the Island Scholars platform'
                  : 'Join Island Scholars and discover amazing opportunities'
                }
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-center items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step 
                        ? 'bg-white text-primary-600' 
                        : 'bg-primary-500 text-white border-2 border-white border-opacity-50'
                    }`}>
                      {currentStep > step ? <FaCheckCircle className="w-5 h-5" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-1 mx-2 ${
                        currentStep > step ? 'bg-white' : 'bg-primary-500'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-white text-sm opacity-90">
                <span>Choose Role</span>
                <span>Basic Info</span>
                <span>Details</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center rounded-md"
              >
                <FaExclamationCircle className="mr-3" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Role Selection */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Role</h2>
                      <p className="text-gray-600">Select how you want to use Island Scholars</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {['student', 'organization', 'university'].map((role) => (
                        <motion.button
                          key={role}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, role }))}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                            formData.role === role
                              ? role === 'student' 
                                ? 'bg-primary-50 border-primary-500 shadow-lg'
                                : role === 'organization'
                                ? 'bg-secondary-50 border-secondary-500 shadow-lg'
                                : 'bg-accent-50 border-accent-500 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex flex-col items-center text-center">
                            <div className={`mb-4 p-4 rounded-full ${
                              formData.role === role
                                ? role === 'student'
                                  ? 'bg-primary-100 text-primary-600'
                                  : role === 'organization'
                                  ? 'bg-secondary-100 text-secondary-600'
                                  : 'bg-accent-100 text-accent-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {getRoleIcon(role)}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 capitalize">
                              {role}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {getRoleDescription(role)}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Basic Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
                      <p className="text-gray-600">
                        {formData.role === 'organization' 
                          ? 'Tell us about your organization'
                          : formData.role === 'university'
                          ? 'Tell us about your university'
                          : 'Let\'s get to know you better'
                        }
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name/Company Name/University Name */}
                      <div>
                        <label htmlFor="name" className="label">
                          {formData.role === 'organization' ? 'Organization Name' : 
                           formData.role === 'university' ? 'University Name' : 'Full Name'} 
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {formData.role === 'organization' ? 
                              <FaBuilding className="h-5 w-5 text-gray-400" /> :
                              formData.role === 'university' ?
                              <FaUniversity className="h-5 w-5 text-gray-400" /> :
                              <FaUser className="h-5 w-5 text-gray-400" />
                            }
                          </div>
                          <input
                            id="name"
                            name={formData.role === 'organization' ? 'companyName' : 'name'}
                            type="text"
                            value={formData.role === 'organization' ? formData.companyName : formData.name}
                            onChange={handleChange}
                            className="input pl-10"
                            placeholder={
                              formData.role === 'organization' ? 'Vodacom Tanzania Ltd' : 
                              formData.role === 'university' ? 'University of Dar es Salaam' : 'John Doe'
                            }
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="label">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input pl-10"
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label htmlFor="password" className="label">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input pl-10"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label htmlFor="confirmPassword" className="label">
                          Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="input pl-10"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Detailed Information */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {formData.role === 'organization' ? 'Organization Details' : 
                         formData.role === 'university' ? 'University Details' : 'Additional Information'}
                      </h2>
                      <p className="text-gray-600">
                        {formData.role === 'organization' 
                          ? 'Complete your organization profile'
                          : formData.role === 'university'
                          ? 'Complete your university profile'
                          : 'Help us personalize your experience'
                        }
                      </p>
                    </div>

                    {formData.role === 'student' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* University */}
                        <div>
                          <label htmlFor="university" className="label">
                            University <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaUniversity className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                              id="university"
                              name="university"
                              value={formData.university}
                              onChange={handleChange}
                              className="input pl-10"
                              required
                            >
                              <option value="">Select your university</option>
                              {tanzanianUniversities.map(uni => (
                                <option key={uni} value={uni}>{uni}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Student ID */}
                        <div>
                          <label htmlFor="studentId" className="label">Student ID</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaIdCard className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="studentId"
                              name="studentId"
                              type="text"
                              value={formData.studentId}
                              onChange={handleChange}
                              className="input pl-10"
                              placeholder="2021-04-12345"
                            />
                          </div>
                        </div>

                        {/* Field of Study */}
                        <div>
                          <label htmlFor="fieldOfStudy" className="label">
                            Field of Study <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="fieldOfStudy"
                            name="fieldOfStudy"
                            type="text"
                            value={formData.fieldOfStudy}
                            onChange={handleChange}
                            className="input"
                            placeholder="Computer Science"
                            required
                          />
                        </div>

                        {/* Year of Study */}
                        <div>
                          <label htmlFor="yearOfStudy" className="label">Year of Study</label>
                          <select
                            id="yearOfStudy"
                            name="yearOfStudy"
                            value={formData.yearOfStudy}
                            onChange={handleChange}
                            className="input"
                          >
                            <option value="">Select year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                            <option value="5">5th Year</option>
                            <option value="graduate">Graduate</option>
                          </select>
                        </div>

                        {/* Phone */}
                        <div className="md:col-span-2">
                          <label htmlFor="phone" className="label">Phone Number</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaPhone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              className="input pl-10"
                              placeholder="+255 123 456 789"
                            />
                          </div>
                        </div>
                      </div>
                    ) : formData.role === 'organization' ? (
                      <div className="space-y-6">
                        {/* Industry and Company Size */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="industry" className="label">
                              Industry <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaIndustry className="h-5 w-5 text-gray-400" />
                              </div>
                              <select
                                id="industry"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="input pl-10"
                                required
                              >
                                <option value="">Select industry</option>
                                {industries.map(industry => (
                                  <option key={industry} value={industry.toLowerCase()}>{industry}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="companySize" className="label">Company Size</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUsers className="h-5 w-5 text-gray-400" />
                              </div>
                              <select
                                id="companySize"
                                name="companySize"
                                value={formData.companySize}
                                onChange={handleChange}
                                className="input pl-10"
                              >
                                <option value="">Select company size</option>
                                {companySizes.map(size => (
                                  <option key={size} value={size}>{size}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div>
                          <label htmlFor="location" className="label">
                            Location <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="location"
                              name="location"
                              type="text"
                              value={formData.location}
                              onChange={handleChange}
                              className="input pl-10"
                              placeholder="Dar es Salaam, Tanzania"
                              required
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="label">
                            Company Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="input"
                            placeholder="Describe your organization, what you do, and your mission..."
                            required
                          />
                        </div>

                        {/* Website and Founded Year */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="website" className="label">Website</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaGlobe className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                id="website"
                                name="website"
                                type="url"
                                value={formData.website}
                                onChange={handleChange}
                                className="input pl-10"
                                placeholder="https://yourcompany.com"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="foundedYear" className="label">Founded Year</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                id="foundedYear"
                                name="foundedYear"
                                type="number"
                                min="1900"
                                max={new Date().getFullYear()}
                                value={formData.foundedYear}
                                onChange={handleChange}
                                className="input pl-10"
                                placeholder="2010"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Registration Number */}
                        <div>
                          <label htmlFor="registrationNumber" className="label">
                            Business Registration Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaIdCard className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="registrationNumber"
                              name="registrationNumber"
                              type="text"
                              value={formData.registrationNumber}
                              onChange={handleChange}
                              className="input pl-10"
                              placeholder="Business license number"
                            />
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="contactPerson" className="label">Contact Person</label>
                              <input
                                id="contactPerson"
                                name="contactPerson"
                                type="text"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                className="input"
                                placeholder="John Doe"
                              />
                            </div>

                            <div>
                              <label htmlFor="contactPhone" className="label">Contact Phone</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <FaPhone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  id="contactPhone"
                                  name="contactPhone"
                                  type="tel"
                                  value={formData.contactPhone}
                                  onChange={handleChange}
                                  className="input pl-10"
                                  placeholder="+255 123 456 789"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : formData.role === 'university' ? (
                      <div className="space-y-6">
                        {/* Location */}
                        <div>
                          <label htmlFor="location" className="label">
                            Location <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="location"
                              name="location"
                              type="text"
                              value={formData.location}
                              onChange={handleChange}
                              className="input pl-10"
                              placeholder="Dar es Salaam, Tanzania"
                              required
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="label">
                            University Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="input"
                            placeholder="Describe your university, its mission, and academic programs..."
                            required
                          />
                        </div>

                        {/* Website and Established Year */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="website" className="label">Website</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaGlobe className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                id="website"
                                name="website"
                                type="url"
                                value={formData.website}
                                onChange={handleChange}
                                className="input pl-10"
                                placeholder="https://youruniversity.ac.tz"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="establishedYear" className="label">Established Year</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                id="establishedYear"
                                name="establishedYear"
                                type="number"
                                min="1800"
                                max={new Date().getFullYear()}
                                value={formData.establishedYear}
                                onChange={handleChange}
                                className="input pl-10"
                                placeholder="1961"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Student and Faculty Count */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="studentCount" className="label">Student Count</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaGraduationCap className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                id="studentCount"
                                name="studentCount"
                                type="number"
                                min="0"
                                value={formData.studentCount}
                                onChange={handleChange}
                                className="input pl-10"
                                placeholder="40000"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="facultyCount" className="label">Faculty Count</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaBook className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                id="facultyCount"
                                name="facultyCount"
                                type="number"
                                min="0"
                                value={formData.facultyCount}
                                onChange={handleChange}
                                className="input pl-10"
                                placeholder="1200"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-outline flex items-center"
                      disabled={loading}
                    >
                      <FaArrowLeft className="mr-2" />
                      Previous
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary flex items-center"
                    >
                      Next
                      <FaArrowRight className="ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn-primary flex items-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          {formData.role === 'organization' ? 'List Organization' : 
                           formData.role === 'university' ? 'Register University' : 'Create Account'}
                          <FaCheckCircle className="ml-2" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center border-t pt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;