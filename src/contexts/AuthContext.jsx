import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved user in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('islandScholarsUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('islandScholarsUser');
      }
    }
    setLoading(false);
  }, []);

  // Login function with improved error handling
  const login = (emailOrUsername, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        // Check for admin credentials (username without @ symbol)
        if (emailOrUsername.toLowerCase() === 'abdillah' && password === '8Characters**') {
          const adminUser = {
            id: 'admin-1',
            name: 'Abdillah Ali',
            email: 'abdillah.va@gmail.com',
            role: 'admin',
            profileImage: '/Abdillah Ali.jpg',
            createdAt: new Date().toISOString()
          };
          
          setCurrentUser(adminUser);
          localStorage.setItem('islandScholarsUser', JSON.stringify(adminUser));
          resolve(adminUser);
        } else {
          // Improved error messages based on input format
          if (!emailOrUsername.includes('@') && !emailOrUsername.includes('.')) {
            // Username format - account not available
            reject(new Error('Account not available'));
          } else if (emailOrUsername.includes('@') && !emailOrUsername.includes('.com')) {
            // Email without .com
            reject(new Error('Please enter a valid email address with .com'));
          } else {
            // Valid email format but account doesn't exist
            reject(new Error('Account not available'));
          }
        }
      }, 800);
    });
  };

  // Register function - now creates users successfully
  const register = (userData) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        try {
          // Create a new user object
          const newUser = {
            id: `user-${Date.now()}`,
            name: userData.role === 'organization' ? userData.companyName : userData.name,
            email: userData.email,
            role: userData.role,
            profileImage: null,
            createdAt: new Date().toISOString(),
            // Add role-specific data
            ...(userData.role === 'student' && {
              university: userData.university,
              studentId: userData.studentId,
              fieldOfStudy: userData.fieldOfStudy,
              yearOfStudy: userData.yearOfStudy,
              phone: userData.phone,
              skills: [],
              documents: {}
            }),
            ...(userData.role === 'organization' && {
              companyName: userData.companyName,
              industry: userData.industry,
              companySize: userData.companySize,
              description: userData.description,
              website: userData.website,
              foundedYear: userData.foundedYear,
              registrationNumber: userData.registrationNumber,
              location: userData.location,
              contactPerson: userData.contactPerson,
              contactPhone: userData.contactPhone,
              desiredSkills: []
            }),
            ...(userData.role === 'university' && {
              universityName: userData.name,
              description: userData.description,
              website: userData.website,
              establishedYear: userData.establishedYear,
              studentCount: userData.studentCount,
              facultyCount: userData.facultyCount,
              location: userData.location,
              programs: userData.programs || []
            })
          };

          // Save user to localStorage and set as current user
          setCurrentUser(newUser);
          localStorage.setItem('islandScholarsUser', JSON.stringify(newUser));
          
          // Resolve with the new user
          resolve(newUser);
        } catch (error) {
          reject(new Error('Registration failed. Please try again.'));
        }
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('islandScholarsUser');
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