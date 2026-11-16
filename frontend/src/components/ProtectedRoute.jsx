import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-300 border-t-[#242424] animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If employer tries to access candidate or vice versa, redirect them to their dashboard
    if (user?.role === 'employer') {
      return <Navigate to="/employer/dashboard" replace />;
    } else {
      return <Navigate to="/candidate/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
