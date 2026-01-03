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
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
};
