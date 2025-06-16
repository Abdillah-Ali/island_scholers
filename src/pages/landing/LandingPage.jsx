import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBuilding, FaUniversity, FaSearch, FaFileAlt, FaHandshake, FaCalendarAlt, FaTrophy, FaUsers, FaStar, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, currentUser } = useAuth();

  // Determine the proper dashboard link based on user role
  const getDashboardLink = () => {
    if (!isAuthenticated) return '/register';
    
    switch (currentUser.role) {
      case 'student':
        return '/student/dashboard';
      case 'organization':
        return '/organization/dashboard';
      case 'university':
        return '/university/dashboard';
      default:
        return '/register';
    }
  };

  const dashboardLink = getDashboardLink();

  // Sample statistics for display
  const statistics = [
    {
      id: 1,
      title: "Platform Ready",
      value: "Island Scholars",
      subtitle: "Connecting talent with opportunity",
      icon: <FaStar className="w-5 h-5" />,
      color: "text-yellow-600"
    },
    {
      id: 2,
      title: "Growing Network",
      value: "Nationwide Coverage",
      subtitle: "Opportunities across Tanzania",
      icon: <FaChartLine className="w-5 h-5" />,
      color: "text-green-600"
    }
  ];
  
  return (
    <div className="space-y-20">
      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-500 opacity-5 -z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-20 -z-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-20 -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-600 leading-tight mb-6"
              >
                Connecting <span className="text-accent-500">Scholars</span> with <span className="text-secondary-500">Opportunities</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-xl text-gray-600 max-w-2xl"
              >
                A dedicated platform that connects Tanzanian college and university students with internship opportunities across Tanzania and Zanzibar. It helps students easily apply for their mandatory field internships required at the end of their academic programs.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <Link to={dashboardLink} className="btn-primary px-8 py-3 text-lg">
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                </Link>
                <Link to="#how-it-works" className="btn-outline px-8 py-3 text-lg">
                  Learn More
                </Link>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex-1 max-w-md"
            >
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260" 
                alt="Students collaborating" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Overview Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-600 mb-4">
              Ready to Transform Tanzania's Future
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join the platform that's connecting Tanzania's brightest minds with leading organizations across the nation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Platform Status Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                  <FaCalendarAlt className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Platform Status</h3>
                  <p className="text-gray-600">Your gateway to opportunities</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="font-medium text-gray-800">Platform Active</span>
                    </div>
                    <span className="text-green-600 text-sm">Ready for use</span>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span className="font-medium text-gray-800">Registration Open</span>
                    </div>
                    <span className="text-blue-600 text-sm">Join now</span>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      <span className="font-medium text-gray-800">Features Available</span>
                    </div>
                    <span className="text-purple-600 text-sm">Full access</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link to="/register" className="text-accent-600 hover:text-accent-700 font-medium">
                  Get Started Today →
                </Link>
              </div>
            </motion.div>

            {/* Network Growth Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mr-4">
                  <FaChartLine className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Growing Network</h3>
                  <p className="text-gray-600">Expanding across Tanzania</p>
                </div>
              </div>

              <div className="space-y-4">
                {statistics.map((stat) => (
                  <div key={stat.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${stat.color} bg-opacity-10`}>
                          <span className={stat.color}>{stat.icon}</span>
                        </div>
                        <h4 className="font-medium text-gray-800">{stat.title}</h4>
                      </div>
                    </div>
                    <div className="ml-11">
                      <p className="font-semibold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.subtitle}</p>
                    </div>
                  </div>
                ))}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 bg-primary-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">Ready</div>
                    <div className="text-sm text-gray-600">For Students</div>
                  </div>
                  <div className="text-center p-3 bg-secondary-50 rounded-lg">
                    <div className="text-2xl font-bold text-secondary-600">Open</div>
                    <div className="text-sm text-gray-600">For Organizations</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link to="/organizations" className="text-secondary-600 hover:text-secondary-700 font-medium">
                  Explore Platform →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* For who section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-600">Who This Platform Is For</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform serves three key groups, creating a vibrant ecosystem for internship opportunities across Tanzania.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* For Students */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="card flex flex-col items-center text-center p-8 hover:border-primary-500 hover:border"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <FaGraduationCap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">For Students</h3>
              <p className="text-gray-600 mb-6">
                Discover internship opportunities with leading Tanzanian organizations, build your professional profile, and connect with industry leaders.
              </p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Create a professional profile</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Apply for internships</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Track application status</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Get personalized recommendations</span>
                </li>
              </ul>
              <Link to="/register" className="btn-outline mt-auto">Sign Up as Student</Link>
            </motion.div>
            
            {/* For Organizations */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="card flex flex-col items-center text-center p-8 hover:border-secondary-500 hover:border"
            >
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
                <FaBuilding className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">For Organizations</h3>
              <p className="text-gray-600 mb-6">
                Find talented Tanzanian students for internships and build your talent pipeline with our comprehensive platform.
              </p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">✓</span>
                  <span>Create organization profile</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">✓</span>
                  <span>Post internship opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">✓</span>
                  <span>Manage student applications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">✓</span>
                  <span>Access talent pool</span>
                </li>
              </ul>
              <Link to="/register" className="btn-outline mt-auto">Join as Organization</Link>
            </motion.div>

            {/* For Universities */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="card flex flex-col items-center text-center p-8 hover:border-accent-500 hover:border"
            >
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mb-6">
                <FaUniversity className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">For Universities</h3>
              <p className="text-gray-600 mb-6">
                Connect your students with quality internship opportunities and manage the internship confirmation process seamlessly.
              </p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">✓</span>
                  <span>Manage student applications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">✓</span>
                  <span>Confirm internship placements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">✓</span>
                  <span>Assign academic supervisors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">✓</span>
                  <span>Generate official letters</span>
                </li>
              </ul>
              <Link to="/register" className="btn-outline mt-auto">Register University</Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How it works section */}
      <section id="how-it-works" className="bg-neutral-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-600">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to explore opportunities, connect with the right people, and launch your career in Tanzania.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <FaSearch className="w-8 h-8 text-primary-600" />
                </div>
                <div className="absolute top-8 left-full w-full h-0.5 bg-primary-200 hidden md:block"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Explore</h3>
              <p className="text-gray-600">
                Browse available internships and organizations across Tanzania and Zanzibar. Discover opportunities aligned with your career goals.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <FaFileAlt className="w-8 h-8 text-primary-600" />
                </div>
                <div className="absolute top-8 left-full w-full h-0.5 bg-primary-200 hidden md:block"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Apply</h3>
              <p className="text-gray-600">
                Submit your application with all required documents. Organizations can review and reach out to candidates directly.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <FaHandshake className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <p className="text-gray-600">
                Build relationships with organizations. Receive official documentation and manage your internship journey.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-green-400">Ready to get started?</h2>
              <p className="mt-4 text-xl text-white text-opacity-90 max-w-2xl">
                Join our platform today and take the first step toward your next great opportunity in Tanzania.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link to="/register" className="btn-accent px-8 py-3 text-lg">
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;