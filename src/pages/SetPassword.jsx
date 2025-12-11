import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Zap } from 'lucide-react';

const SetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [employeeName, setEmployeeName] = useState('');

    // Validate token on mount
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setError('Invalid or missing token. Please use the link from your email.');
                setValidating(false);
                return;
            }

            try {
                const result = await authAPI.validateToken(token);
                setTokenValid(true);
                setEmployeeName(result.name || 'Employee');
            } catch (err) {
                setError(err.message || 'Invalid or expired token. Please contact your administrator.');
                setTokenValid(false);
            } finally {
                setValidating(false);
            }
        };

        validateToken();
    }, [token]);

    const validatePassword = () => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number';
        }
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validatePassword();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            await authAPI.setPassword(token, password);
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to set password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Loading state while validating token
    if (validating) {
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
                        <h2>Validating...</h2>
                        <p className="login-subtitle">Please wait while we verify your link</p>
                        <div className="loading-spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (success) {
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
                            <div className="logo-circle success"><CheckCircle size={32} /></div>
                        </div>
                        <h2>Password Set Successfully!</h2>
                        <p className="login-subtitle">You can now log in with your new password</p>
                        <p className="help-text">Redirecting to login page...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state (invalid token)
    if (!tokenValid) {
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
                            <div className="logo-circle error"><AlertCircle size={32} /></div>
                        </div>
                        <h2>Invalid Link</h2>
                        <p className="login-subtitle">{error}</p>
                        <button className="login-btn" onClick={() => navigate('/login')}>
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                        <div className="logo-circle"><Lock size={32} /></div>
                    </div>
                    <h2>Welcome, {employeeName}!</h2>
                    <p className="login-subtitle">Create your password to access your account</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>New Password</label>
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
                            <small className="password-hint">
                                Min 8 characters, with uppercase, lowercase, and number
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="password-input">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="login-btn" disabled={loading}>
                            <Lock size={16} />
                            {loading ? 'Setting Password...' : 'Set Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SetPassword;
