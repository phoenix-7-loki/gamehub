import React from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { userEmail, userRole } = useUserStore();

  if (!userEmail) return <Navigate to="/login" replace />;
  if (requiredRole && userRole !== requiredRole) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;