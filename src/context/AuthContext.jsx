import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      const storedUser = {
        username: localStorage.getItem('username') || 'User',
        role: localStorage.getItem('user_role') || 'admin',
        employee_id: localStorage.getItem('employee_id') || null,
        name: localStorage.getItem('user_name') || 'User'
      };
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const data = await authAPI.login(username, password);

      // Extract role from response (default to admin for backward compatibility)
      const role = data.role || 'admin';
      const employeeId = data.employee_id || null;
      const name = data.name || username;

      // Store user info
      localStorage.setItem('username', username);
      localStorage.setItem('user_role', role);
      localStorage.setItem('user_name', name);
      if (employeeId) {
        localStorage.setItem('employee_id', employeeId);
      }

      const userData = {
        username,
        name,
        role,
        employee_id: employeeId
      };

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, role };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      localStorage.removeItem('username');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
      localStorage.removeItem('employee_id');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Helper to check if user has required role
  const hasRole = (requiredRole) => {
    if (!user) return false;
    if (requiredRole === 'any') return true;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    return user.role === requiredRole;
  };

  // Check if user is admin
  const isAdmin = () => user?.role === 'admin';

  // Check if user is employee
  const isEmployee = () => user?.role === 'employee';

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      hasRole,
      isAdmin,
      isEmployee
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
