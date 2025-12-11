import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Wraps routes that require specific roles
 * 
 * Usage:
 * <ProtectedRoute allowedRoles={['admin']}>
 *   <AdminOnlyComponent />
 * </ProtectedRoute>
 * 
 * <ProtectedRoute allowedRoles={['admin', 'employee']}>
 *   <AnyAuthenticatedComponent />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children, allowedRoles = ['admin', 'employee'] }) => {
    const { isAuthenticated, user, hasRole } = useAuth();
    const location = useLocation();

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has required role
    const hasAccess = allowedRoles.some(role => hasRole(role));

    if (!hasAccess) {
        // Redirect based on user role
        if (user?.role === 'employee') {
            return <Navigate to="/employee-dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
