import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, role, ...rest }) => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const hasRole = checkRole(role);

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated && hasRole ? (
          <Component {...props} />
        ) : (
          <Redirect to="/unauthorized" />
        )
      }
    />
  );
};

export default ProtectedRoute;