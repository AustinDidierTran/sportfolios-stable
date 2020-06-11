import React from 'react';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';

import teal from '@material-ui/core/colors/teal';

import { Router, Switch, Route } from 'react-router-dom';

import AdminPanel from '../AdminPanel';
import Header from '../Header';
import Login from '../Login';
import Main from '../Main';
import ConfirmationEmailSent from '../ConfirmationEmailSent';
import ConfirmEmail from '../ConfirmEmail';
import ConfirmEmailFailure from '../ConfirmEmail/ConfirmEmailFailure';
import ConfirmEmailSuccess from '../ConfirmEmail/ConfirmEmailSuccess';
import EventView from '../Event';
import ForgotPassword from '../ForgotPassword';
import Organization from '../Organization';
import OrganizationSettings from '../Organization/Settings';
import CreateOrganization from '../Organization/Create';
import OrganizationNotFound from '../OrganizationNotFound';
import OrganizationList from '../OrganizationList';
import PasswordRecovery from '../PasswordRecovery';
import Profile from '../Profile';
import Search from '../Search';
import Signup from '../Signup';
import Team from '../Team';
import UserSettings from '../UserSettings';
import Notifications from '../../views/Notifications';
import Menu from '../Menu';

// Mocks
import MockSelfProfile from '../Mocks/Profile/Self';
import MockOrganization from '../Mocks/Organization';
import MockEvent from '../Mocks/Event';

// Custom
import { BottomNavigation } from '../../components/Custom';

import styles from './App.module.css';
import history from '../../stores/history';
import AdminRoute from './AdminRoute';
import PrivateRoute from './PrivateRoute';
import { ROUTES } from '../../actions/goTo';

export default function App() {
  const theme = createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    palette: {
      primary: teal,
    },
  });

  theme.typography.h3 = {
    fontFamily: 'Helvetica',
    fontWeight: 350,
    fontSize: '1.4rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.8rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2.4rem',
    },
  };

  theme.typography.h4 = {
    fontFamily: 'Helvetica',
    fontWeight: 350,
    fontSize: '1.2rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.6rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2.1rem',
    },
  };

  theme.typography.h5 = {
    fontFamily: 'Helvetica',
    fontWeight: 350,
    fontSize: '1rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.4rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.8rem',
    },
  };

  theme.typography.h6 = {
    fontFamily: 'Helvetica',
    fontWeight: 350,
    fontSize: '0.8rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.2rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.5rem',
    },
  };

  theme.typography.h7 = {
    fontFamily: 'Helvetica',
    fontWeight: 350,
    fontSize: '0.6rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.0rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.2rem',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <div className={styles.app}>
          <div className={styles.header}>
            <Header />
          </div>
          <div className={styles.main}>
            <Switch>
              <AdminRoute
                path={ROUTES.adminPanel}
                component={AdminPanel}
              />
              <Route
                path={ROUTES.confirmEmail}
                component={ConfirmEmail}
              />
              <Route
                path={ROUTES.confirmEmailFailure}
                component={ConfirmEmailFailure}
              />
              <Route
                path={ROUTES.confirmEmailSuccess}
                component={ConfirmEmailSuccess}
              />
              <Route path={ROUTES.event} component={EventView} />
              <Route
                path={ROUTES.forgotPassword}
                component={ForgotPassword}
              />
              <Route
                path={ROUTES.recoveryEmail}
                component={PasswordRecovery}
              />
              <Route
                exact
                path={ROUTES.mockSelfProfile}
                component={MockSelfProfile}
              />
              <Route
                exact
                path={ROUTES.mockOrganization}
                component={MockOrganization}
              />
              <Route
                exact
                path={ROUTES.mockEvent}
                component={MockEvent}
              />
              <Route exact path={ROUTES.login} component={Login} />
              <Route
                exact
                path={ROUTES.organizationList}
                component={OrganizationList}
              />
              <Route
                exact
                path={ROUTES.createOrganization}
                component={CreateOrganization}
              />
              <Route
                exact
                path={ROUTES.organizationNotFound}
                component={OrganizationNotFound}
              />
              <Route
                path={ROUTES.organization}
                component={Organization}
              />
              <Route exact path={ROUTES.signup} component={Signup} />
              <Route
                exact
                path={ROUTES.confirmationEmailSent}
                component={ConfirmationEmailSent}
              />
              <Route
                exact
                path={ROUTES.notifications}
                component={Notifications}
              />
              <Route path={ROUTES.team} component={Team} />
              <PrivateRoute
                path={ROUTES.profile}
                component={Profile}
              />
              <PrivateRoute path={ROUTES.search} component={Search} />
              <PrivateRoute
                path={ROUTES.userSettings}
                component={UserSettings}
              />
              <PrivateRoute path={ROUTES.menu} component={Menu} />
              <PrivateRoute component={Main} />
            </Switch>
          </div>
          <BottomNavigation />
        </div>
      </Router>
    </ThemeProvider>
  );
}
