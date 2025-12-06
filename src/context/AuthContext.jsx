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
      setIsAuthenticated(true);
      setUser({ username: localStorage.getItem('username') || 'User' });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      await authAPI.login(username, password);
      localStorage.setItem('username', username);
      setUser({ username, name: username, role: 'HR Manager' });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      localStorage.removeItem('username');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

