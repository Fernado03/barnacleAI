import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../shared/Loading';

// Protected Route component
const ProtectedRoute = ({ 
  children, 
  roles = [], 
  redirectTo = '/login',
  fallback = null 
}) => {
  const { 
    isAuthenticated, 
    isInitialized, 
    isLoading, 
    user, 
    hasAnyRole 
  } = useAuth();
  const location = useLocation();

  // Show loading while authentication is being verified
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700">
        <div className="w-full max-w-md space-y-6 text-center">
          <Loading 
            size="large" 
            variant="default" 
            color="white"
            message="Verifying authentication..."
          />
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access if roles are specified
  if (roles.length > 0 && !hasAnyRole(roles)) {
    // Show fallback component or default unauthorized message
    if (fallback) {
      return fallback;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700">
        <div className="max-w-md mx-auto text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl">
          <div className="text-6xl text-white/50 mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/80 mb-6">
            You don't have permission to access this page.
            Required role: {roles.join(' or ')}
          </p>
          <p className="text-white/60 text-sm">
            Current role: {user?.role || 'None'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized, render children
  return children;
};

// Public Route component (only accessible when not authenticated)
export const PublicRoute = ({ 
  children, 
  redirectTo = '/', 
  restricted = false 
}) => {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while authentication is being verified
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700">
        <div className="w-full max-w-md space-y-6 text-center">
          <Loading 
            size="large" 
            variant="default" 
            color="white"
            message="Loading..."
          />
        </div>
      </div>
    );
  }

  // If route is restricted and user is authenticated, redirect
  if (restricted && isAuthenticated) {
    const from = location.state?.from || redirectTo;
    return <Navigate to={from} replace />;
  }

  // Render children
  return children;
};

// Role-based route component
export const RoleRoute = ({ 
  children, 
  allowedRoles = [], 
  fallback = null 
}) => {
  const { user, hasAnyRole } = useAuth();

  // Check if user has required role
  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="p-8 text-center">
        <div className="text-6xl text-gray-300 mb-4">👥</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Role-Based Access
        </h2>
        <p className="text-gray-600 mb-4">
          This section is only available to: {allowedRoles.join(', ')}
        </p>
        <p className="text-sm text-gray-500">
          Your current role: {user?.role || 'None'}
        </p>
      </div>
    );
  }

  return children;
};

// Admin-only route
export const AdminRoute = ({ children, fallback = null }) => {
  return (
    <RoleRoute 
      allowedRoles={['Admin', 'Super Admin']} 
      fallback={fallback}
    >
      {children}
    </RoleRoute>
  );
};

// Captain-only route
export const CaptainRoute = ({ children, fallback = null }) => {
  return (
    <RoleRoute 
      allowedRoles={['Captain', 'Fleet Captain', 'Admin']} 
      fallback={fallback}
    >
      {children}
    </RoleRoute>
  );
};

// Fleet Operator route
export const FleetOperatorRoute = ({ children, fallback = null }) => {
  return (
    <RoleRoute 
      allowedRoles={['Fleet Operator', 'Fleet Manager', 'Admin']} 
      fallback={fallback}
    >
      {children}
    </RoleRoute>
  );
};

export default ProtectedRoute;