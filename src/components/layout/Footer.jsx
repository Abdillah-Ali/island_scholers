import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Container, Row, Col } from 'react-bootstrap';

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
      color: "#00b894",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <footer className="footer position-relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0.1 }}>
        <motion.div 
          className="position-absolute rounded-circle"
          style={{ 
            top: '40px', 
            left: '40px', 
            width: '128px', 
            height: '128px', 
            background: 'var(--island-coral)' 
          }}
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
          className="position-absolute rounded-circle"
          style={{ 
            top: '80px', 
            right: '80px', 
            width: '96px', 
            height: '96px', 
            background: 'var(--island-teal)' 
          }}
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
          className="position-absolute rounded-circle"
          style={{ 
            bottom: '40px', 
            left: '33%', 
            width: '80px', 
            height: '80px', 
            background: 'var(--island-coral)' 
          }}
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

      {/* Wave Effect */}
      <div className="position-absolute top-0 start-0 w-100 overflow-hidden">
        <motion.svg
          className="position-relative d-block w-100"
          style={{ height: '48px' }}
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
        
      <Container className="py-5 position-relative" style={{ zIndex: 10 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Row className="g-4">
            {/* Company info */}
            <Col md={3}>
              <motion.div variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link to="/" className="text-decoration-none">
                    <h4 className="text-white fw-bold mb-3">Island Scholars</h4>
                  </Link>
                </motion.div>
                
                {/* Contact Info */}
                <motion.div className="mb-4" variants={itemVariants}>
                  <motion.div 
                    className="d-flex align-items-center text-white-50 mb-2 small"
                    whileHover={{ x: 5, color: 'white' }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaMapMarkerAlt className="me-2 text-info" />
                    <span>Tunguu Zanzibar</span>
                  </motion.div>
                  <motion.div 
                    className="d-flex align-items-center text-white-50 mb-2 small"
                    whileHover={{ x: 5, color: 'white' }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaPhone className="me-2 text-info" />
                    <span>+255 788 008 750</span>
                  </motion.div>
                  <motion.div 
                    className="d-flex align-items-center text-white-50 small"
                    whileHover={{ x: 5, color: 'white' }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaEnvelope className="me-2 text-info" />
                    <span>abdillah.va@gmail.com</span>
                  </motion.div>
                </motion.div>
                
                {/* Social links */}
                <motion.div className="d-flex gap-3" variants={itemVariants}>
                  {[
                    { icon: FaLinkedin, href: "#", color: "text-primary" },
                    { icon: FaGithub, href: "#", color: "text-light" }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      className={`text-white-50 ${social.color} fs-5`}
                      variants={socialIconVariants}
                      whileHover="hover"
                      whileTap={{ scale: 0.9 }}
                    >
                      <social.icon />
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            </Col>
            
            {/* Navigation links */}
            <Col md={3}>
              <motion.div variants={itemVariants}>
                <motion.h5 
                  className="text-white fw-semibold mb-3"
                  whileHover={{ color: "#00b894" }}
                  transition={{ duration: 0.3 }}
                >
                  For Students
                </motion.h5>
                <ul className="list-unstyled">
                  {[
                    { to: "/internships", text: "Find Internships" },
                    { to: "/organizations", text: "Explore Organizations" },
                    { to: "/register", text: "Create an Account" },
                    { to: "#", text: "Resources" }
                  ].map((link, index) => (
                    <motion.li key={index} className="mb-2" variants={linkVariants} whileHover="hover">
                      <Link 
                        to={link.to} 
                        className="text-white-50 text-decoration-none small"
                      >
                        {link.text}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </Col>
            
            <Col md={3}>
              <motion.div variants={itemVariants}>
                <motion.h5 
                  className="text-white fw-semibold mb-3"
                  whileHover={{ color: "#00b894" }}
                  transition={{ duration: 0.3 }}
                >
                  For Organizations
                </motion.h5>
                <ul className="list-unstyled">
                  {[
                    { to: "/register", text: "Join the Platform" },
                    { to: "#", text: "Post Opportunities" },
                    { to: "/organizations", text: "Partner Network" },
                    { to: "#", text: "Success Stories" }
                  ].map((link, index) => (
                    <motion.li key={index} className="mb-2" variants={linkVariants} whileHover="hover">
                      <Link 
                        to={link.to} 
                        className="text-white-50 text-decoration-none small"
                      >
                        {link.text}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </Col>
            
            <Col md={3}>
              <motion.div variants={itemVariants}>
                <motion.h5 
                  className="text-white fw-semibold mb-3"
                  whileHover={{ color: "#00b894" }}
                  transition={{ duration: 0.3 }}
                >
                  Company
                </motion.h5>
                <ul className="list-unstyled">
                  {[
                    { to: "#", text: "About Us" },
                    { to: "#", text: "Contact" },
                    { to: "#", text: "Privacy Policy" },
                    { to: "#", text: "Terms of Service" }
                  ].map((link, index) => (
                    <motion.li key={index} className="mb-2" variants={linkVariants} whileHover="hover">
                      <Link 
                        to={link.to} 
                        className="text-white-50 text-decoration-none small"
                      >
                        {link.text}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </Col>
          </Row>
          
          {/* Bottom section */}
          <motion.div 
            className="mt-5 pt-4 border-top border-secondary border-opacity-25"
            variants={itemVariants}
          >
            <div className="text-center">
              <motion.p 
                className="text-white-50 small mb-0"
                whileHover={{ color: 'white' }}
                transition={{ duration: 0.3 }}
              >
                &copy; {currentYear} Island Scholars. All rights reserved. Made By Abdillah Ali
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Floating particles animation */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none' }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="position-absolute rounded-circle bg-white"
            style={{
              width: '8px',
              height: '8px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.2
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