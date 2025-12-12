const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/api'  // Local development
  : 'https://vortex-hrms.onrender.com/api'; // Live Production

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ============ IMPROVED ERROR HANDLER & AUTO LOGOUT ============
const handleResponse = async (response) => {
  // 1. Check if response is actually JSON
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(text.slice(0, 100) || "Server Error (Non-JSON)");
  }

  // 2. If the token is expired (401), clear storage and kick user to login
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    localStorage.removeItem('employee_id');
    window.location.href = '/login';
    throw new Error("Session expired. Please login again.");
  }

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
    throw new Error(data.error || data.message || 'Something went wrong');
  }
  return data;
};

// ============ DASHBOARD API ============
export const dashboardAPI = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ============ ATTENDANCE API ============
export const attendanceAPI = {
  // Get all logs (with optional date filter)
  getAll: async (date) => {
    const query = date ? `?date=${date}` : '';
    const response = await fetch(`${API_BASE_URL}/attendance/${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get stats for the summary cards
  getStats: async (date) => {
    const query = date ? `?date=${date}` : '';
    const response = await fetch(`${API_BASE_URL}/attendance/stats/${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // NEW: Employee check-in
  checkIn: async () => {
    const response = await fetch(`${API_BASE_URL}/attendance/check-in/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // NEW: Employee check-out
  checkOut: async () => {
    const response = await fetch(`${API_BASE_URL}/attendance/check-out/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // NEW: Get today's attendance for current user
  getToday: async () => {
    const response = await fetch(`${API_BASE_URL}/attendance/today/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // NEW: Get monthly report
  getReport: async (month) => {
    const query = month ? `?month=${month}` : '';
    const response = await fetch(`${API_BASE_URL}/attendance/report/${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // NEW: Get attendance by employee ID
  getByEmployee: async (employeeId, date = null) => {
    let query = `?employee_id=${employeeId}`;
    if (date) query += `&date=${date}`;
    const response = await fetch(`${API_BASE_URL}/attendance/${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ============ PAYROLL API ============
export const payrollAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/payroll/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/payroll/payroll_stats/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  runPayroll: async () => {
    const response = await fetch(`${API_BASE_URL}/payroll/run_payroll/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // NEW: Set payroll status (Admin only)
  // Uses standard REST PATCH on the payroll record
  setStatus: async (payrollId, status) => {
    const response = await fetch(`${API_BASE_URL}/payroll/${payrollId}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // NEW: Get payroll by employee ID
  getByEmployee: async (employeeId) => {
    const response = await fetch(`${API_BASE_URL}/payroll/?employee_id=${employeeId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // NEW: Get payroll status logs
  getStatusLogs: async (payrollId) => {
    const response = await fetch(`${API_BASE_URL}/payroll/${payrollId}/logs/`, {
      headers: getAuthHeaders()
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
      localStorage.removeItem('user_role');
      localStorage.removeItem('username');
      localStorage.removeItem('employee_id');
      localStorage.removeItem('user_name');
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // NEW: Register employee (Admin creates account)
  registerEmployee: async (employeeData) => {
    const response = await fetch(`${API_BASE_URL}/employee/register/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(employeeData)
    });
    return handleResponse(response);
  },

  // NEW: Set password via token (Employee sets their password)
  setPassword: async (token, password) => {
    const response = await fetch(`${API_BASE_URL}/employee/set-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    return handleResponse(response);
  },

  // NEW: Validate password reset token
  validateToken: async (token) => {
    const response = await fetch(`${API_BASE_URL}/employee/validate-token/?token=${token}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
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

  // NEW: Get current employee's profile
  getMyProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/employee/me/`, {
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
  },

  // NEW: Create login for employee (Admin action)
  createLogin: async (employeeId, loginData) => {
    const response = await fetch(`${API_BASE_URL}/employee/${employeeId}/create-login/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(loginData)
    });
    return handleResponse(response);
  }
};

// ============ RECRUITMENT API ============
export const recruitmentAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/recruitment/jobs/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/recruitment/jobs/dashboard_stats/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (jobData) => {
    const response = await fetch(`${API_BASE_URL}/recruitment/jobs/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/recruitment/jobs/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (response.status === 204) return true;
    return handleResponse(response);
  }
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

// ============ ONBOARDING API ============
export const onboardingAPI = {
  getTasks: async (employeeId = '') => {
    const query = employeeId ? `?employee_id=${employeeId}` : '';
    const response = await fetch(`${API_BASE_URL}/onboarding/${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getNewHires: async () => {
    const response = await fetch(`${API_BASE_URL}/onboarding/new_hires/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  updateTask: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/onboarding/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  createTask: async (data) => {
    const response = await fetch(`${API_BASE_URL}/onboarding/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }
};

// ============ ASSETS API ============
export const assetsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/assets/inventory/`, { headers: getAuthHeaders() });
    return handleResponse(response);
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/assets/inventory/category_stats/`, { headers: getAuthHeaders() });
    return handleResponse(response);
  },

  getRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/assets/requests/`, { headers: getAuthHeaders() });
    return handleResponse(response);
  },

  createRequest: async (data) => {
    const response = await fetch(`${API_BASE_URL}/assets/requests/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updateRequestStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/assets/requests/${id}/update_status/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  }
};

// ============ SETTINGS API ============
export const settingsAPI = {
  getSettings: async () => {
    const response = await fetch(`${API_BASE_URL}/settings/`, { headers: getAuthHeaders() });
    return handleResponse(response);
  },

  updateSettings: async (data) => {
    const response = await fetch(`${API_BASE_URL}/settings/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
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