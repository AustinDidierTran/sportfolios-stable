import React, { useContext } from 'react';
import theme from './theme';
import { ThemeProvider } from '@material-ui/core/styles';

import { Router, Switch, Route } from 'react-router-dom';

import {
  createInstance,
  OptimizelyProvider,
} from '@optimizely/react-sdk';

import AdminPanel from '../AdminPanel';
import ConfirmationEmailSent from '../ConfirmationEmailSent';
import ConfirmEmail from '../ConfirmEmail';
import Entity from '../Entity';
import EntityCreate from '../../components/Custom/EntityCreate';
import EntityNotFound from '../Entity/EntityNotFound';
import EventRegistration from '../EventRegistration';
import ConfirmEmailFailure from '../ConfirmEmail/ConfirmEmailFailure';
import ConfirmEmailSuccess from '../ConfirmEmail/ConfirmEmailSuccess';
import ForgotPassword from '../ForgotPassword';
import Header from '../Header';
import Login from '../Login';
import Main from '../Main';
import Memberships from '../Memberships';
import Menu from '../Menu';
import Notifications from '../../views/Notifications';
import OrganizationList from '../Main/OrganizationList';
import PasswordRecovery from '../PasswordRecovery';
import RegistrationStatus from '../RegistrationStatus';
import Search from '../Search';
import Signup from '../Signup';
import Stripe from '../../utils/stripe/Payment/index';
import UserSettings from '../UserSettings';
import Cart from '../Cart';
import Checkout from '../Checkout';
import ShopDetails from '../ShopDetails';

// Mocks
import MockEvent from '../Mocks/Event';

// Custom
import { BottomNavigation } from '../../components/Custom';

import styles from './App.module.css';
import history from '../../stores/history';
import AdminRoute from './AdminRoute';
import PrivateRoute from './PrivateRoute';
import { ROUTES } from '../../actions/goTo';
import { Store } from '../../Store';
import conf from '../../../../conf';
import { SpeedDial } from '../../components/Custom';
export default function App() {
  const {
    state: {
      userInfo: { user_id },
    },
  } = useContext(Store);

  const optimizely = createInstance(conf.optimizely);

  return (
    <OptimizelyProvider
      optimizely={optimizely}
      user={{
        id: user_id,
      }}
    >
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
                  path={ROUTES.create}
                  component={EntityCreate}
                />
                <Route
                  exact
                  path={ROUTES.entityNotFound}
                  component={EntityNotFound}
                />
                <Route
                  exact
                  path={ROUTES.signup}
                  component={Signup}
                />
                <Route
                  exact
                  path={ROUTES.registrationStatus}
                  component={RegistrationStatus}
                />
                <Route
                  exact
                  path={ROUTES.eventRegistration}
                  component={EventRegistration}
                />
                <Route
                  exact
                  path={ROUTES.confirmationEmailSent}
                  component={ConfirmationEmailSent}
                />
                <Route
                  exact
                  path={ROUTES.memberships}
                  component={Memberships}
                />
                <Route
                  exact
                  path={ROUTES.notifications}
                  component={Notifications}
                />
                <Route exact path={ROUTES.cart} component={Cart} />
                <Route
                  exact
                  path={ROUTES.checkout}
                  component={Checkout}
                />
                <Route
                  exact
                  path={ROUTES.stripe}
                  component={Stripe}
                />
                <Route
                  exact
                  path={ROUTES.shopDetails}
                  component={ShopDetails}
                />
                <PrivateRoute
                  path={ROUTES.search}
                  component={Search}
                />
                <PrivateRoute
                  path={ROUTES.userSettings}
                  component={UserSettings}
                />
                <PrivateRoute path={ROUTES.menu} component={Menu} />
                <Route path={ROUTES.entity} component={Entity} />
                <PrivateRoute component={Main} />
              </Switch>
            </div>
            <SpeedDial />
            <BottomNavigation />
          </div>
        </Router>
      </ThemeProvider>
    </OptimizelyProvider>
  );
}
