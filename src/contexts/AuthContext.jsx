import { createContext, useState, useContext, useEffect } from 'react';
import { authApi, ApiError } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for saved user in localStorage on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('islandScholarsUser');
      const savedToken = localStorage.getItem('islandScholarsToken');
      
      if (savedUser && savedToken) {
        try {
          const user = JSON.parse(savedUser);
          
          // Verify token is still valid by testing connection
          await authApi.testConnection();
          setCurrentUser(user);
        } catch (error) {
          console.error('Token validation failed:', error);
          // Clear invalid token and user data
          localStorage.removeItem('islandScholarsUser');
          localStorage.removeItem('islandScholarsToken');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Test API connection
  const testConnection = async () => {
    try {
      const response = await authApi.testConnection();
      console.log('API connection test successful:', response);
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  };

  // Login function
  const login = async (usernameOrEmail, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authApi.login({
        usernameOrEmail,
        password,
      });

      const user = {
        id: response.id,
        name: `${response.firstName} ${response.lastName}`,
        email: response.email,
        role: response.role.toLowerCase(),
        firstName: response.firstName,
        lastName: response.lastName,
        username: response.username,
      };

      setCurrentUser(user);
      localStorage.setItem('islandScholarsUser', JSON.stringify(user));
      localStorage.setItem('islandScholarsToken', response.accessToken);

      return user;
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Test connection first
      const connectionOk = await testConnection();
      if (!connectionOk) {
        throw new Error('Cannot connect to server. Please make sure the backend is running.');
      }

      const requestBody = {
        username: userData.email.split('@')[0], // Use email prefix as username
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || userData.name?.split(' ')[0] || '',
        lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '',
        role: userData.role.toUpperCase(),
        phoneNumber: userData.phone || userData.contactPhone,
        location: userData.location,
        bio: userData.bio || userData.description,
        
        // Student specific fields
        university: userData.university,
        studentId: userData.studentId,
        yearOfStudy: userData.yearOfStudy ? parseInt(userData.yearOfStudy) : null,
        fieldOfStudy: userData.fieldOfStudy,
        skills: userData.skills || [],
        
        // Organization specific fields
        companyName: userData.companyName,
        industry: userData.industry,
        companySize: userData.companySize,
        description: userData.description,
        website: userData.website,
        foundedYear: userData.foundedYear ? parseInt(userData.foundedYear) : null,
        registrationNumber: userData.registrationNumber,
        desiredSkills: userData.desiredSkills || [],
        
        // University specific fields
        universityName: userData.name,
        establishedYear: userData.establishedYear ? parseInt(userData.establishedYear) : null,
        studentCount: userData.studentCount ? parseInt(userData.studentCount) : null,
        facultyCount: userData.facultyCount ? parseInt(userData.facultyCount) : null,
        programs: userData.programs || [],
      };

      await authApi.register(requestBody);

      // After successful registration, log the user in
      return await login(userData.email, userData.password);
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setError(null);
    localStorage.removeItem('islandScholarsUser');
    localStorage.removeItem('islandScholarsToken');
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    testConnection,
    clearError,
    isAuthenticated: !!currentUser,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};