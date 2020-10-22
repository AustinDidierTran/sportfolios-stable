import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Store } from '../../Store';
import history from '../../stores/history';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const {
    state: { authToken },
  } = useContext(Store);

  return (
    <Route
      {...rest}
      render={props =>
        authToken ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={`/login?redirectUrl=${history.location.pathname}`}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
