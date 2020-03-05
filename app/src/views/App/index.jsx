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

import styles from './App.module.css';
import history from '../../stores/history';

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
              <Route path="/confirmEmail/:token" component={ConfirmEmail} />
              <Route path="/ConfirmEmailFailure" component={ConfirmEmailFailure} />
              <Route path="/confirmEmailSuccess" component={ConfirmEmailSuccess} />
              <Route path="/forgot_password" component={ForgotPassword} />
              <Route path="/recoveryEmail/:token" component={PasswordRecovery} />
              <Route exact path="/login" component={Login} />
              <Route
                exact
                path="/confirmation_email_sent"
                component={ConfirmationEmailSent}
              />
              <Route exact path="/signup" component={Signup} />
              <Route
                exact
                path="/"
                component={Main}
              />
              <Route
                component={Main}
              />
            </Switch>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}
