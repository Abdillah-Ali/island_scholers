import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaExclamationCircle, FaEye, FaEyeSlash, FaUserGraduate, FaBuilding, FaUniversity } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form with specific error messages
    if (!emailOrUsername) {
      setError('Email or username is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    
    // Clear any previous errors
    setError('');
    setLoading(true);
    
    try {
      const user = await login(emailOrUsername, password);
      
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
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate(from);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full opacity-10"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div 
          className="absolute top-40 right-20 w-24 h-24 bg-accent-200 rounded-full opacity-20"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/4 w-20 h-20 bg-white rounded-full opacity-15"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-40 right-1/3 w-16 h-16 bg-secondary-300 rounded-full opacity-20"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 0.5 }}
        />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          {/* Left Side - Welcome Content */}
          <motion.div 
            variants={itemVariants}
            className="hidden lg:block"
          >
            <div className="text-center lg:text-left">
              <motion.h1 
                className="text-4xl lg:text-5xl font-bold text-white mb-6"
                variants={itemVariants}
              >
                Welcome Back to <span className="text-accent-300">Island Scholars</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-white opacity-90 mb-8 leading-relaxed"
                variants={itemVariants}
              >
                Log in to access your profile, track your applications, and connect with organizations ready to support your professional growth.
              </motion.p>
              
              {/* Feature highlights */}
              <motion.div 
                className="space-y-4"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                    <FaUserGraduate className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">For Students</h3>
                    <p className="text-white opacity-80">Find and apply for internships</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                    <FaBuilding className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">For Organizations</h3>
                    <p className="text-white opacity-80">Post opportunities and find talent</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                    <FaUniversity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">For Universities</h3>
                    <p className="text-white opacity-80">Connect students with opportunities</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-md mx-auto lg:mx-0"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              {/* Header */}
              <motion.div 
                className="text-center mb-8"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserGraduate className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your Island Scholars account</p>
              </motion.div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center rounded-md"
                >
                  <FaExclamationCircle className="mr-3 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email/Username Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="emailOrUsername" className="label">Email or Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="emailOrUsername"
                      type="text"
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                      className="input pl-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      placeholder="you@example.com or username"
                      required
                    />
                  </div>
                </motion.div>
                
                {/* Password Field */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="password" className="label">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pl-10 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>
                
                {/* Remember Me & Forgot Password */}
                <motion.div 
                  className="flex items-center justify-between"
                  variants={itemVariants}
                >
                  <div className="flex items-center">
                    <input
                      id="remember_me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 transition-colors"
                    />
                    <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="text-primary-600 hover:text-primary-500 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                </motion.div>
                
                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 transform ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                  variants={itemVariants}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </form>
              
              {/* Sign Up Link */}
              <motion.div 
                className="mt-8 text-center"
                variants={itemVariants}
              >
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;