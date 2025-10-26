import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo || !userInfo.isAdmin) {
    // Redirect to login if not authenticated or not admin
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;