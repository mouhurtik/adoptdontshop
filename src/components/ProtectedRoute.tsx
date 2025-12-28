import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
    children: ReactNode;
    /** Required roles to access this route. If not provided, any authenticated user can access. */
    requiredRoles?: UserRole[];
    /** Path to redirect to when not authenticated. Defaults to /login */
    redirectTo?: string;
}

/**
 * Protected Route component
 * Wraps routes that require authentication and optionally specific roles
 * 
 * Usage:
 * <Route path="/admin" element={
 *   <ProtectedRoute requiredRoles={['admin']}>
 *     <AdminDashboard />
 *   </ProtectedRoute>
 * } />
 */
const ProtectedRoute = ({
    children,
    requiredRoles,
    redirectTo = '/login',
}: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking auth status
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        // Save the attempted URL for redirecting after login
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check role-based access if requiredRoles are specified
    if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = user && requiredRoles.includes(user.role);

        if (!hasRequiredRole) {
            // User is authenticated but doesn't have the required role
            // Redirect to home or an unauthorized page
            return <Navigate to="/" replace />;
        }
    }

    // User is authenticated and has required role (if any)
    return <>{children}</>;
};

export default ProtectedRoute;
