import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/common/Spinner';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="page-loading-state">
        <Spinner size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="page-loading-state">
        <Spinner size={32} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return children;
};
