import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBuilding, FaUniversity, FaSearch, FaFileAlt, FaHandshake, FaCalendarAlt, FaTrophy, FaUsers, FaStar, FaChartLine } from 'react-icons/fa';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
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
      icon: <FaStar className="fs-5" />,
      color: "warning"
    },
    {
      id: 2,
      title: "Growing Network",
      value: "Nationwide Coverage",
      subtitle: "Opportunities across Tanzania",
      icon: <FaChartLine className="fs-5" />,
      color: "success"
    }
  ];
  
  return (
    <div>
      {/* Hero section */}
      <section className="hero-section position-relative overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0.05 }}>
          <div className="position-absolute rounded-circle bg-white" style={{ top: '-96px', right: '-96px', width: '384px', height: '384px', filter: 'blur(60px)' }} />
          <div className="position-absolute rounded-circle bg-white" style={{ bottom: '-96px', left: '-96px', width: '384px', height: '384px', filter: 'blur(60px)' }} />
        </div>
        
        <Container className="py-5 position-relative" style={{ zIndex: 10 }}>
          <Row className="align-items-center min-vh-75 py-5">
            <Col lg={6} className="mb-5 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="display-3 fw-bold text-white mb-4 lh-1">
                  Connecting <span className="text-warning">Scholars</span> with <span className="text-info">Opportunities</span>
                </h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="lead text-white-75 mb-4"
                >
                  A dedicated platform that connects Tanzanian college and university students with internship opportunities across Tanzania and Zanzibar. It helps students easily apply for their mandatory field internships required at the end of their academic programs.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="d-flex flex-wrap gap-3"
                >
                  <Button as={Link} to={dashboardLink} size="lg" className="btn-warning px-4 py-3">
                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                  </Button>
                  <Button as={Link} to="#how-it-works" variant="outline-light" size="lg" className="px-4 py-3">
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>
            </Col>
            
            <Col lg={6}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center"
              >
                <img 
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260" 
                  alt="Students collaborating" 
                  className="img-fluid rounded-3 shadow-island-lg"
                  style={{ maxHeight: '500px', objectFit: 'cover' }}
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Platform Overview Section */}
      <section className="bg-island-pattern py-5">
        <Container className="py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-5"
          >
            <h2 className="display-4 fw-bold text-gradient-primary mb-4">
              Ready to Transform Tanzania's Future
            </h2>
            <p className="lead text-muted">
              Join the platform that's connecting Tanzania's brightest minds with leading organizations across the nation
            </p>
          </motion.div>

          <Row className="g-4">
            {/* Platform Status Card */}
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-100 border-0 shadow-island">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="feature-icon warning me-3" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
                        <FaCalendarAlt />
                      </div>
                      <div>
                        <h4 className="mb-1">Platform Status</h4>
                        <p className="text-muted mb-0">Your gateway to opportunities</p>
                      </div>
                    </div>

                    <div className="d-grid gap-3">
                      <div className="p-3 bg-success bg-opacity-10 rounded-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="bg-success rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                            <span className="fw-medium">Platform Active</span>
                          </div>
                          <span className="text-success small">Ready for use</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-info bg-opacity-10 rounded-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="bg-info rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                            <span className="fw-medium">Registration Open</span>
                          </div>
                          <span className="text-info small">Join now</span>
                        </div>
                      </div>

                      <div className="p-3 bg-warning bg-opacity-10 rounded-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="bg-warning rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                            <span className="fw-medium">Features Available</span>
                          </div>
                          <span className="text-warning small">Full access</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <Link to="/register" className="text-decoration-none fw-medium">
                        Get Started Today →
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* Network Growth Card */}
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="h-100 border-0 shadow-island">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="feature-icon secondary me-3" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
                        <FaChartLine />
                      </div>
                      <div>
                        <h4 className="mb-1">Growing Network</h4>
                        <p className="text-muted mb-0">Expanding across Tanzania</p>
                      </div>
                    </div>

                    <div className="d-grid gap-3">
                      {statistics.map((stat) => (
                        <div key={stat.id} className="p-3 bg-light rounded-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center">
                              <div className={`bg-${stat.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3`} style={{ width: '32px', height: '32px' }}>
                                <span className={`text-${stat.color}`}>{stat.icon}</span>
                              </div>
                              <h6 className="mb-0">{stat.title}</h6>
                            </div>
                          </div>
                          <div style={{ marginLeft: '44px' }}>
                            <p className="fw-semibold mb-1">{stat.value}</p>
                            <p className="text-muted small mb-0">{stat.subtitle}</p>
                          </div>
                        </div>
                      ))}

                      {/* Quick Stats */}
                      <Row className="g-3 mt-2">
                        <Col xs={6}>
                          <div className="text-center p-3 bg-primary bg-opacity-10 rounded-3">
                            <div className="h4 fw-bold text-primary mb-1">Ready</div>
                            <div className="small text-muted">For Students</div>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="text-center p-3 bg-secondary bg-opacity-10 rounded-3">
                            <div className="h4 fw-bold text-secondary mb-1">Open</div>
                            <div className="small text-muted">For Organizations</div>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="text-center mt-4">
                      <Link to="/organizations" className="text-decoration-none fw-medium">
                        Explore Platform →
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* For who section */}
      <section className="py-5 bg-white">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-gradient-primary mb-4">Who This Platform Is For</h2>
            <p className="lead text-muted">
              Our platform serves three key groups, creating a vibrant ecosystem for internship opportunities across Tanzania.
            </p>
          </div>
          
          <Row className="g-4">
            {/* For Students */}
            <Col lg={4}>
              <motion.div 
                whileHover={{ y: -10 }}
                className="h-100"
              >
                <Card className="feature-card text-center h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="feature-icon primary mx-auto mb-4">
                      <FaGraduationCap />
                    </div>
                    <h4 className="mb-3">For Students</h4>
                    <p className="text-muted mb-4">
                      Discover internship opportunities with leading Tanzanian organizations, build your professional profile, and connect with industry leaders.
                    </p>
                    <ul className="list-unstyled text-start mb-4 flex-grow-1">
                      <li className="d-flex align-items-start mb-2">
                        <span className="text-primary me-2">✓</span>
                        <span>Create a professional profile</span>
                      </li>
                      <li className="d-flex align-items-start mb-2">
                        <span className="text-primary me-2">✓</span>
                        <span>Apply for internships</span>
                      </li>
                      <li className="d-flex align-items-start mb-2">
                        <span className="text-primary me-2">✓</span>
                        <span>Track application status</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <span className="text-primary me-2">✓</span>
                        <span>Get personalized recommendations</span>
                      </li>
                    </ul>
                    <Button as={Link} to="/register" variant="outline-primary" className="mt-auto">
                      Sign Up as Student
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            
            {/* For Organizations */}
            <Col lg={4}>
              <motion.div 
                whileHover={{ y: -10 }}
                className="h-100"
              >
                <Card className="feature-card text-center h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="feature-icon secondary mx-auto mb-4">
                      <FaBuilding />
                    </div>
                    <h4 className="mb-3">For Organizations</h4>
                    <p className="text-muted mb-4">
                      Find talented Tanzanian students for internships and build your talent pipeline with our comprehensive platform.
                    </p>
                    <ul className="list-unstyled text-start mb-4 flex-grow-1">
                      <li className="d-flex align-items-start mb-2">
                        <span className="text-secondary me-2">✓</span>
                        <span>Create organization profile</span>
                      </li>
                      <li className="d-flex align-items-start mb-2">
                        <span className="text-secondary me-2">✓</span>
                        <span>Post internship opportunities</span>
                      </li>
                      <li className="d-flex align-items-start mb-2">
                        <span className="text-secondary me-2">✓</span>
                        <span>Manage student applications</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <span className="text-secondary me-2">✓</span>
                        <span>Access talent pool</span>
                      </li>
                    </ul>
                    <Button as={Link} to="/register" variant="outline-secondary" className="mt-auto">
                      Join as Organization
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* For Universities */}
            <Col lg={4}>
              <motion.div 
                whileHover={{ y: -10 }}
                className="h-100"
              >
                <Card className="feature-card text-center h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="feature-icon warning mx-auto mb-4">
                      <FaUniversity />
                    </div>
                    <h4 className="mb-3">For Universities</h4>
                    <p className="text-muted mb-4">
                      Connect your students with quality internship opportunities and manage the internship confirmation process seamlessly.
                    </p>
                    <ul className="list-unstyled text-start mb-4 flex-grow-1">
                      <li className="d-flex align-items-start mb-2">
                        <span className="text-warning me-2">✓</span>
                        <span>Manage student applications</span>
                      </li>
                      <li className="d-flex align-items-start mb-2">
                        <span className="text-warning me-2">✓</span>
                        <span>Confirm internship placements</span>
                      </li>
                      <li className="d-flex align-items-start mb-2">
                        <span className="text-warning me-2">✓</span>
                        <span>Assign academic supervisors</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <span className="text-warning me-2">✓</span>
                        <span>Generate official letters</span>
                      </li>
                    </ul>
                    <Button as={Link} to="/register" variant="outline-warning" className="mt-auto">
                      Register University
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* How it works section */}
      <section id="how-it-works" className="py-5 bg-light">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-gradient-primary mb-4">How It Works</h2>
            <p className="lead text-muted">
              Our platform makes it easy to explore opportunities, connect with the right people, and launch your career in Tanzania.
            </p>
          </div>
          
          <Row className="g-4">
            {/* Step 1 */}
            <Col lg={4}>
              <div className="text-center">
                <div className="position-relative mb-4">
                  <div className="feature-icon primary mx-auto">
                    <FaSearch />
                  </div>
                  <div className="position-absolute top-50 start-100 w-100 d-none d-lg-block" style={{ height: '2px', background: 'var(--bs-primary)', opacity: 0.2 }}></div>
                </div>
                <h4 className="mb-3">Explore</h4>
                <p className="text-muted">
                  Browse available internships and organizations across Tanzania and Zanzibar. Discover opportunities aligned with your career goals.
                </p>
              </div>
            </Col>
            
            {/* Step 2 */}
            <Col lg={4}>
              <div className="text-center">
                <div className="position-relative mb-4">
                  <div className="feature-icon secondary mx-auto">
                    <FaFileAlt />
                  </div>
                  <div className="position-absolute top-50 start-100 w-100 d-none d-lg-block" style={{ height: '2px', background: 'var(--bs-secondary)', opacity: 0.2 }}></div>
                </div>
                <h4 className="mb-3">Apply</h4>
                <p className="text-muted">
                  Submit your application with all required documents. Organizations can review and reach out to candidates directly.
                </p>
              </div>
            </Col>
            
            {/* Step 3 */}
            <Col lg={4}>
              <div className="text-center">
                <div className="feature-icon warning mx-auto mb-4">
                  <FaHandshake />
                </div>
                <h4 className="mb-3">Connect</h4>
                <p className="text-muted">
                  Build relationships with organizations. Receive official documentation and manage your internship journey.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* CTA section */}
      <section className="bg-gradient-primary text-white py-5">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={8}>
              <h2 className="display-4 fw-bold text-warning mb-3">Ready to get started?</h2>
              <p className="lead mb-0">
                Join our platform today and take the first step toward your next great opportunity in Tanzania.
              </p>
            </Col>
            <Col lg={4} className="text-lg-end">
              <Button as={Link} to="/register" size="lg" className="btn-warning px-4 py-3">
                Sign Up Now
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;