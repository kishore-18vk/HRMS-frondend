const API_BASE_URL = 'http://localhost:8000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Handle API response
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
};

// ============ AUTH API ============
export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await handleResponse(response);
    // Store tokens
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  },

  signup: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(response);
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      await fetch(`${API_BASE_URL}/logout/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ refresh: refreshToken })
      });
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
};

// ============ EMPLOYEE API ============
export const employeeAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const url = `${API_BASE_URL}/employee/employee-profile/${params ? '?' + params : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (employeeId) => {
    const response = await fetch(`${API_BASE_URL}/employee/employee-profile/?employee_id=${employeeId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (employeeData) => {
    const response = await fetch(`${API_BASE_URL}/employee/employee-profile/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(employeeData)
    });
    return handleResponse(response);
  },

  update: async (id, employeeData) => {
    const response = await fetch(`${API_BASE_URL}/employee/employee-profile/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id, ...employeeData })
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/employee/employee-profile/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id })
    });
    return handleResponse(response);
  }
};

// ============ HOLIDAY API ============
export const holidayAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/holidays/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/holidays/${id}/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (holidayData) => {
    const response = await fetch(`${API_BASE_URL}/holidays/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(holidayData)
    });
    return handleResponse(response);
  },

  update: async (id, holidayData) => {
    const response = await fetch(`${API_BASE_URL}/holidays/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(holidayData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/holidays/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.ok;
  }
};

