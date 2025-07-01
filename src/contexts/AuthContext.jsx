import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_BASE_URL = 'http://localhost:8080/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const testConnection = async () => {
    try {
      const token = localStorage.getItem('islandScholarsToken');

      const response = await fetch(`${API_BASE_URL}/auth/test`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        console.error('API connection test failed:', response.status);
        return false;
      }

      const data = await response.json();
      console.log('API connection test successful:', data);
      return true;
    } catch (error) {
      console.error('API connection test error:', error);
      return false;
    }
  };

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
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
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const connected = await testConnection();
      if (!connected) {
        throw new Error('Cannot connect to server. Please make sure the backend is running.');
      }

      const requestBody = {
        username: userData.email.split('@')[0],
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || (userData.name ? userData.name.split(' ')[0] : ''),
        lastName: userData.lastName || (userData.name ? userData.name.split(' ').slice(1).join(' ') : ''),
        role: userData.role?.toUpperCase() || 'USER',
        phoneNumber: userData.phone || userData.contactPhone || '',
        location: userData.location || '',
        bio: userData.bio || userData.description || '',

        university: userData.university || '',
        studentId: userData.studentId || '',
        yearOfStudy: userData.yearOfStudy ? parseInt(userData.yearOfStudy) : null,
        fieldOfStudy: userData.fieldOfStudy || '',
        skills: userData.skills || [],

        companyName: userData.companyName || '',
        industry: userData.industry || '',
        companySize: userData.companySize || '',
        description: userData.description || '',
        website: userData.website || '',
        foundedYear: userData.foundedYear ? parseInt(userData.foundedYear) : null,
        registrationNumber: userData.registrationNumber || '',
        desiredSkills: userData.desiredSkills || [],

        universityName: userData.name || '',
        establishedYear: userData.establishedYear ? parseInt(userData.establishedYear) : null,
        studentCount: userData.studentCount ? parseInt(userData.studentCount) : null,
        facultyCount: userData.facultyCount ? parseInt(userData.facultyCount) : null,
        programs: userData.programs || [],
      };

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return await login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('islandScholarsUser');
    localStorage.removeItem('islandScholarsToken');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        testConnection,
        isAuthenticated: Boolean(currentUser),
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
