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

  // Register function - now expects real authentication
  const register = (userData) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        // In a real app, this would make an API call to your Django backend
        // For now, we'll reject with a message to set up real authentication
        reject(new Error('Please set up registration with your backend API'));
      }, 800);
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