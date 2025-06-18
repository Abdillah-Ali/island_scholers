import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const API_BASE_URL = 'http://localhost:8080/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved user in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('islandScholarsUser');
    const savedToken = localStorage.getItem('islandScholarsToken');
    
    if (savedUser && savedToken) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('islandScholarsUser');
        localStorage.removeItem('islandScholarsToken');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (usernameOrEmail, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const user = {
        id: data.id,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: data.role.toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      };

      setCurrentUser(user);
      localStorage.setItem('islandScholarsUser', JSON.stringify(user));
      localStorage.setItem('islandScholarsToken', data.accessToken);

      return user;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // After successful registration, log the user in
      return await login(userData.email, userData.password);
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('islandScholarsUser');
    localStorage.removeItem('islandScholarsToken');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};