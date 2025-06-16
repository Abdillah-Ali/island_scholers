import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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

  const socialIconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const linkVariants = {
    hover: {
      x: 5,
      color: "#FF6B6B",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 bg-accent-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute top-20 right-20 w-24 h-24 bg-secondary-400 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-10 left-1/3 w-20 h-20 bg-accent-300 rounded-full"
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Animated Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <motion.svg
          className="relative block w-full h-12"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <motion.path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="rgba(255, 255, 255, 0.1)"
            animate={{
              d: [
                "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
                "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z",
                "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              ]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.svg>
      </div>
        
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <motion.div className="md:col-span-1" variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link to="/" className="text-2xl font-bold text-white hover:text-accent-300 transition-colors duration-300">
                Island Scholars
              </Link>
            </motion.div>
            
            {/* Contact Info */}
            <motion.div className="mt-4 space-y-2" variants={itemVariants}>
              <motion.div 
                className="flex items-center text-white opacity-80 hover:opacity-100 transition-opacity duration-300"
                whileHover={{ x: 5 }}
              >
                <FaMapMarkerAlt className="mr-2 text-accent-300" />
                <span className="text-sm">Tunguu Zanzibar</span>
              </motion.div>
              <motion.div 
                className="flex items-center text-white opacity-80 hover:opacity-100 transition-opacity duration-300"
                whileHover={{ x: 5 }}
              >
                <FaPhone className="mr-2 text-accent-300" />
                <span className="text-sm">+255 788 008 750</span>
              </motion.div>
              <motion.div 
                className="flex items-center text-white opacity-80 hover:opacity-100 transition-opacity duration-300"
                whileHover={{ x: 5 }}
              >
                <FaEnvelope className="mr-2 text-accent-300" />
                <span className="text-sm">abdillah.va@gmail.com</span>
              </motion.div>
            </motion.div>
            
            {/* Social links */}
            <motion.div className="mt-6 flex space-x-4" variants={itemVariants}>
              {[
                { icon: FaLinkedin, href: "#", color: "hover:text-blue-400" },
                { icon: FaGithub, href: "#", color: "hover:text-gray-300" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className={`text-white opacity-80 ${social.color} transition-all duration-300`}
                  variants={socialIconVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Navigation links */}
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="text-lg font-semibold mb-4 text-white"
              whileHover={{ color: "#FF6B6B" }}
              transition={{ duration: 0.3 }}
            >
              For Students
            </motion.h3>
            <ul className="space-y-3">
              {[
                { to: "/internships", text: "Find Internships" },
                { to: "/organizations", text: "Explore Organizations" },
                { to: "/register", text: "Create an Account" },
                { to: "#", text: "Resources" }
              ].map((link, index) => (
                <motion.li key={index} variants={linkVariants} whileHover="hover">
                  <Link 
                    to={link.to} 
                    className="text-white opacity-80 hover:opacity-100 text-sm transition-all duration-300 block"
                  >
                    {link.text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="text-lg font-semibold mb-4 text-white"
              whileHover={{ color: "#FF6B6B" }}
              transition={{ duration: 0.3 }}
            >
              For Organizations
            </motion.h3>
            <ul className="space-y-3">
              {[
                { to: "/register", text: "Join the Platform" },
                { to: "#", text: "Post Opportunities" },
                { to: "/organizations", text: "Partner Network" },
                { to: "#", text: "Success Stories" }
              ].map((link, index) => (
                <motion.li key={index} variants={linkVariants} whileHover="hover">
                  <Link 
                    to={link.to} 
                    className="text-white opacity-80 hover:opacity-100 text-sm transition-all duration-300 block"
                  >
                    {link.text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="text-lg font-semibold mb-4 text-white"
              whileHover={{ color: "#FF6B6B" }}
              transition={{ duration: 0.3 }}
            >
              Company
            </motion.h3>
            <ul className="space-y-3">
              {[
                { to: "#", text: "About Us" },
                { to: "#", text: "Contact" },
                { to: "#", text: "Privacy Policy" },
                { to: "#", text: "Terms of Service" }
              ].map((link, index) => (
                <motion.li key={index} variants={linkVariants} whileHover="hover">
                  <Link 
                    to={link.to} 
                    className="text-white opacity-80 hover:opacity-100 text-sm transition-all duration-300 block"
                  >
                    {link.text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        {/* Bottom section */}
        <motion.div 
          className="mt-12 pt-8 border-t border-white border-opacity-20"
          variants={itemVariants}
        >
          <div className="text-center">
            <motion.p 
              className="text-sm text-white opacity-80"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              &copy; {currentYear} Island Scholars. All rights reserved. Made By Abdillah Ali
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;