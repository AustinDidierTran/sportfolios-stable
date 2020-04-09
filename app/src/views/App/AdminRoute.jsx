import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Store } from '../../Store';
import APP_ROLES from './appRoles';

const AdminRoute = ({ component: Component, ...rest }) => {
  const {
    state: { userInfo },
  } = useContext(Store);

  const isAdmin =
    userInfo && userInfo.app_role === APP_ROLES.APP_ADMIN;

  return (
    <Route
      {...rest}
      render={props =>
        isAdmin ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default AdminRoute;
