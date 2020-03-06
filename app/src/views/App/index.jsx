import React from 'react';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';

import teal from '@material-ui/core/colors/teal';

import { Router, Switch, Route } from 'react-router-dom';

import Header from '../Header';
import Login from '../Login';
import Main from '../Main';
import Signup from '../Signup';
import ConfirmationEmailSent from '../ConfirmationEmailSent';
import ConfirmEmail from '../ConfirmEmail';
import ConfirmEmailFailure from '../ConfirmEmail/ConfirmEmailFailure';
import ConfirmEmailSuccess from '../ConfirmEmail/ConfirmEmailSuccess';
import ForgotPassword from '../ForgotPassword';
import PasswordRecovery from '../PasswordRecovery';
import UserSettings from '../UserSettings';

import styles from './App.module.css';
import history from '../../stores/history';
import PrivateRoute from './PrivateRoute';
import { ROUTES } from '../../actions/goTo';

const theme = createMuiTheme({
  palette: {
    primary: teal,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <div className={styles.app}>
          <div className={styles.header}>
            <Header />
          </div>
          <div className={styles.main}>
            <Switch>
              <Route path={ROUTES.confirmEmail} component={ConfirmEmail} />
              <Route path={ROUTES.confirmEmailFailure} component={ConfirmEmailFailure} />
              <Route path={ROUTES.confirmEmailSuccess} component={ConfirmEmailSuccess} />
              <Route path={ROUTES.forgotPassword} component={ForgotPassword} />
              <Route path={ROUTES.recoveryEmail} component={PasswordRecovery} />
              <Route exact path={ROUTES.login} component={Login} />
              <Route
                exact
                path={ROUTES.confirmationEmailSent}
                component={ConfirmationEmailSent}
              />
              <Route exact path={ROUTES.signup} component={Signup} />
              <PrivateRoute path={ROUTES.userSettings}
                component={UserSettings}
              />
              <PrivateRoute
                component={Main}
              />
            </Switch>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}