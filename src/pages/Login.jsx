import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn, Zap } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      // Redirect based on role
      if (result.role === 'employee') {
        navigate('/employee-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-branding">
          <h1>VORTEX</h1>
          <p>Next-Gen HR Management Platform</p>
        </div>
      </div>
      <div className="login-right">
        <div className="login-box">
          <div className="login-logo">
            <div className="logo-circle"><Zap size={32} /></div>
          </div>
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to access your Vortex dashboard</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              <LogIn size={16} />
              {loading ? 'Signing in...' : 'Secure Sign-in'}
            </button>
          </form>

          <div className="help-text">
            <p>Note: Use username <strong>admin</strong> and password <strong>admin</strong> to log in as Admin.</p>
          </div>

          <a href="#" className="forgot-password">Forgot password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
