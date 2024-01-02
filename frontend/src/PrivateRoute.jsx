import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ path, element, isLoggedIn, isAdmin }) => {
  if (isLoggedIn && isAdmin) {
    return <Route path={path} element={element} />;
  } else {
    return <Navigate to={isLoggedIn ? '/home' : '/login'} replace />;
  }
};

export default PrivateRoute;