import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Landing Pages
import LandingPage from './pages/landing/LandingPage';

// Dashboard Pages
import StudentDashboard from './pages/dashboard/StudentDashboard';
import OrganizationDashboard from './pages/dashboard/OrganizationDashboard';
import UniversityDashboard from './pages/dashboard/UniversityDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Profile Pages
import StudentProfile from './pages/profiles/StudentProfile';
import OrganizationProfile from './pages/profiles/OrganizationProfile';
import UniversityProfile from './pages/profiles/UniversityProfile';

// Internship Pages
import InternshipExplore from './pages/internships/InternshipExplore';
import InternshipDetails from './pages/internships/InternshipDetails';
import InternshipApplication from './pages/internships/InternshipApplication';

// Organization Pages
import OrganizationList from './pages/organizations/OrganizationList';

// Admin Pages
import AdminUsers from './pages/admin/AdminUsers';
import AdminInternships from './pages/admin/AdminInternships';
import AdminApplications from './pages/admin/AdminApplications';
import AdminEvents from './pages/admin/AdminEvents';
import AdminOrganizations from './pages/admin/AdminOrganizations';
import AdminUniversities from './pages/admin/AdminUniversities';
import AdminSettings from './pages/admin/AdminSettings';

// Protected Route
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              
              {/* Public Organization and Internship Routes */}
              <Route path="organizations" element={<OrganizationList />} />
              <Route path="internships" element={<InternshipExplore />} />
              <Route path="internships/:id" element={<InternshipDetails />} />
              
              {/* Protected Routes */}
              {/* Student Routes */}
              <Route 
                path="student/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="student/profile" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="student/internships/:id/apply" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <InternshipApplication />
                  </ProtectedRoute>
                } 
              />
              
              {/* Organization Routes */}
              <Route 
                path="organization/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['organization']}>
                    <OrganizationDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="organization/profile" 
                element={
                  <ProtectedRoute allowedRoles={['organization']}>
                    <OrganizationProfile />
                  </ProtectedRoute>
                } 
              />
              
              {/* University Routes */}
              <Route 
                path="university/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['university']}>
                    <UniversityDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="university/profile" 
                element={
                  <ProtectedRoute allowedRoles={['university']}>
                    <UniversityProfile />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/internships" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminInternships />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/applications" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminApplications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/events" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminEvents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/organizations" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminOrganizations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/universities" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUniversities />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/settings" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;