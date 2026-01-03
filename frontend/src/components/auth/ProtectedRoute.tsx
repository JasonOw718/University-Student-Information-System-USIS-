import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const location = useLocation();
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();

    if (!isAuthenticated || !user) {
        // Redirect to login if not authenticated
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
        // Redirect if role is not allowed
        // User asked to redirect to auth if unauthorized
        // We could also redirect to their respective dashboard if we wanted to be smarter, 
        // but strict requirement is "fail redirection will go back to auth"
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
};
