// API service layer for all backend communications
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('islandScholarsToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API request handler with error handling
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: getAuthHeaders(),
    ...options,
    ...(options.body && typeof options.body === 'object' && {
      body: JSON.stringify(options.body)
    })
  };

  try {
    const response = await fetch(url, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || data || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new ApiError(
        'Cannot connect to server. Please check your internet connection and ensure the backend is running.',
        0,
        null
      );
    }
    
    throw new ApiError(
      error.message || 'An unexpected error occurred',
      0,
      null
    );
  }
};

// Authentication API
export const authApi = {
  // Test connection
  testConnection: () => apiRequest('/auth/test'),
  
  // Login
  login: (credentials) => apiRequest('/auth/signin', {
    method: 'POST',
    body: credentials
  }),
  
  // Register
  register: (userData) => apiRequest('/auth/signup', {
    method: 'POST',
    body: userData
  })
};

// Internships API
export const internshipsApi = {
  // Get all internships with optional filters
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    return apiRequest(`/internships${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get internship by ID
  getById: (id) => apiRequest(`/internships/${id}`),
  
  // Create internship (organizations only)
  create: (internshipData) => apiRequest('/internships', {
    method: 'POST',
    body: internshipData
  }),
  
  // Update internship
  update: (id, internshipData) => apiRequest(`/internships/${id}`, {
    method: 'PUT',
    body: internshipData
  }),
  
  // Delete internship
  delete: (id) => apiRequest(`/internships/${id}`, {
    method: 'DELETE'
  }),
  
  // Get organization's internships
  getMyInternships: () => apiRequest('/internships/my-internships')
};

// Applications API
export const applicationsApi = {
  // Create application
  create: (applicationData) => apiRequest('/applications', {
    method: 'POST',
    body: applicationData
  }),
  
  // Get student's applications
  getMyApplications: () => apiRequest('/applications/my-applications'),
  
  // Get received applications (for organizations)
  getReceived: () => apiRequest('/applications/received'),
  
  // Get application by ID
  getById: (id) => apiRequest(`/applications/${id}`),
  
  // Update application status (organizations)
  updateStatus: (id, statusData) => apiRequest(`/applications/${id}/status`, {
    method: 'PUT',
    body: statusData
  }),
  
  // Withdraw application (students)
  withdraw: (id) => apiRequest(`/applications/${id}/withdraw`, {
    method: 'PUT'
  }),
  
  // Delete application
  delete: (id) => apiRequest(`/applications/${id}`, {
    method: 'DELETE'
  })
};

// Events API
export const eventsApi = {
  // Get all events
  getAll: () => apiRequest('/events'),
  
  // Get upcoming events
  getUpcoming: () => apiRequest('/events/upcoming'),
  
  // Get event by ID
  getById: (id) => apiRequest(`/events/${id}`),
  
  // Create event (organizations only)
  create: (eventData) => apiRequest('/events', {
    method: 'POST',
    body: eventData
  }),
  
  // Update event
  update: (id, eventData) => apiRequest(`/events/${id}`, {
    method: 'PUT',
    body: eventData
  }),
  
  // Delete event
  delete: (id) => apiRequest(`/events/${id}`, {
    method: 'DELETE'
  }),
  
  // Get organization's events
  getMyEvents: () => apiRequest('/events/my-events')
};

// Organizations API
export const organizationsApi = {
  // Get all organizations with optional filters
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    return apiRequest(`/organizations${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get organization by ID
  getById: (id) => apiRequest(`/organizations/${id}`)
};

// Universities API
export const universitiesApi = {
  // Get all universities with optional search
  getAll: (search = '') => {
    const queryString = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest(`/universities${queryString}`);
  },
  
  // Get university by ID
  getById: (id) => apiRequest(`/universities/${id}`),
  
  // Get university by name
  getByName: (name) => apiRequest(`/universities/by-name/${encodeURIComponent(name)}`)
};

// Export the ApiError class for use in components
export { ApiError };