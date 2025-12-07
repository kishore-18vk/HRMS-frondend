const API_BASE_URL = 'http://localhost:8000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ============ RECRUITMENT API ============
export const recruitmentAPI = {
  // Get all jobs
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/recruitment/jobs/`, { 
      headers: getAuthHeaders() 
    });
    return handleResponse(response);
  },

  // Get dashboard stats
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/recruitment/jobs/dashboard_stats/`, { 
      headers: getAuthHeaders() 
    });
    return handleResponse(response);
  },

  // Create a new job
  create: async (jobData) => {
    const response = await fetch(`${API_BASE_URL}/recruitment/jobs/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData)
    });
    return handleResponse(response);
  },

  // Delete a job
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/recruitment/jobs/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    // Django REST Framework returns 204 No Content on success, which isn't valid JSON
    if (response.status === 204) return true;
    return handleResponse(response);
  }
};

// ============ IMPROVED ERROR HANDLER & AUTO LOGOUT ============
const handleResponse = async (response) => {
  // 1. Check if response is actually JSON
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(text.slice(0, 100) || "Server Error (Non-JSON)"); 
  }

  // 2. === AUTO LOGOUT FIX (Add this part) ===
  // If the token is expired (401), clear storage and kick user to login
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login'; // Redirect to login page
    throw new Error("Session expired. Please login again.");
  }
  // ==========================================

  const data = await response.json();
  
  if (!response.ok) {
    // 3. If backend sends specific field errors (Django style)
    if (typeof data === 'object' && !data.error) {
       const messages = Object.entries(data)
         .map(([key, val]) => `${key}: ${Array.isArray(val) ? val[0] : val}`)
         .join('\n');
       if (messages) throw new Error(messages);
    }
    // 4. Fallback to generic error
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
};

// ============ LEAVE API ============
export const leaveAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const url = `${API_BASE_URL}/leaves/${params ? '?' + params : ''}`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
  },

  create: async (leaveData) => {
    const response = await fetch(`${API_BASE_URL}/leaves/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(leaveData)
    });
    return handleResponse(response);
  },

  update: async (id, leaveData) => {
    const response = await fetch(`${API_BASE_URL}/leaves/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id, ...leaveData })
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/leaves/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id })
    });
    return handleResponse(response);
  }
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
    const response = await fetch(url, { headers: getAuthHeaders() });
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
    const response = await fetch(`${API_BASE_URL}/holidays/`, { headers: getAuthHeaders() });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/holidays/${id}/`, { headers: getAuthHeaders() });
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