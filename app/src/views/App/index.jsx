import React, { useContext, useEffect } from 'react';
import theme from './theme';
import { ThemeProvider } from '@material-ui/core/styles';
import loadable from '@loadable/component';
import { Router, Switch, Route } from 'react-router-dom';
const PrivacyPolicy = loadable(() => import('../PrivacyPolicy'));
const Login = loadable(() => import('../Login'));
const AddBankAccount = loadable(() => import('../AddBankAccount'));
const AddPaymentMethod = loadable(() =>
  import('../AddPaymentMethod'),
);
const AdminPanel = loadable(() => import('../AdminPanel'));
const ConfirmationEmailSent = loadable(() =>
  import('../ConfirmationEmailSent'),
);
const ConfirmEmail = loadable(() => import('../ConfirmEmail'));
const Entity = loadable(() => import('../Entity'));
const EntityCreate = loadable(() =>
  import('../../components/Custom/EntityCreate'),
);
const EntityNotFound = loadable(() =>
  import('../Entity/EntityNotFound'),
);
const EventRegistration = loadable(() =>
  import('../EventRegistration'),
);
const ConfirmEmailFailure = loadable(() =>
  import('../ConfirmEmail/ConfirmEmailFailure'),
);
const ConfirmEmailSuccess = loadable(() =>
  import('../ConfirmEmail/ConfirmEmailSuccess'),
);
const Header = loadable(() => import('../Header'));
const Main = loadable(() => import('../Main'));
const Menu = loadable(() => import('../Menu'));
const Notifications = loadable(() =>
  import('../../views/Notifications'),
);
const OrderProcessed = loadable(() => import('../OrderProcessed'));
const MembersList = loadable(() => import('../MembersList'));
const OrganizationList = loadable(() =>
  import('../Main/OrganizationList'),
);
const PasswordRecovery = loadable(() =>
  import('../PasswordRecovery'),
);
const ProductAddedToCart = loadable(() =>
  import('../ProductAddedToCart'),
);
const RedirectWithToken = loadable(() =>
  import('../RedirectWithToken'),
);
const RegistrationStatus = loadable(() =>
  import('../RegistrationStatus'),
);
const CreateReport = loadable(() => import('../CreateReport'));
const ScheduleInteractiveTool = loadable(() =>
  import('../ScheduleInteractiveTool'),
);
const ScheduleManager = loadable(() => import('../ScheduleManager'));
const Search = loadable(() => import('../Search'));
const Stripe = loadable(() =>
  import('../../utils/stripe/Payment/index'),
);
const UserSettings = loadable(() => import('../UserSettings'));
const Cart = loadable(() => import('../Cart'));
const Checkout = loadable(() => import('../Checkout'));
const ImportMembers = loadable(() => import('../ImportMembers'));
const Sales = loadable(() => import('../Sales'));
const ShopDetails = loadable(() => import('../ShopDetails'));
const TransferPerson = loadable(() => import('../TransferPerson'));
const TransferPersonExpired = loadable(() =>
  import('../TransferPerson/TransferPersonExpired'),
);
const RosterInvite = loadable(() => import('../RosterInvite'));

import {
  AddGaPageView,
  InitGa,
} from '../../components/Custom/Analytics';

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
import SnackBar from './SnackBar/index';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe(conf.STRIPE.publicKey);

export default function App() {
  const {
    state: { authToken },
  } = useContext(Store);
  const isAuthenticated = Boolean(authToken);

  useEffect(() => {
    InitGa();
    AddGaPageView();
  });

  return (
    <Elements stripe={stripePromise}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <div className={styles.app}>
            <div className={styles.header}>
              <Header />
            </div>
            <div
              className={isAuthenticated ? styles.main : styles.main1}
            >
              <Switch>
                <AdminRoute
                  path={ROUTES.adminPanel}
                  component={AdminPanel}
                />
                <PrivateRoute
                  exact
                  path={ROUTES.rosterInviteLink}
                  component={RosterInvite}
                />
                <Route
                  path={ROUTES.redirectWithToken}
                  component={RedirectWithToken}
                />
                <Route
                  path={ROUTES.redirectWithToken}
                  component={RedirectWithToken}
                />
                <Route
                  path={ROUTES.privacyPolicy}
                  component={PrivacyPolicy}
                />
                <Route
                  path={ROUTES.addPaymentMethod}
                  component={AddPaymentMethod}
                />
                <Route
                  path={ROUTES.addBankAccount}
                  component={AddBankAccount}
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
                  path={ROUTES.recoveryEmail}
                  component={PasswordRecovery}
                />
                <Route
                  path={ROUTES.transferPerson}
                  component={TransferPerson}
                />
                <Route
                  path={ROUTES.transferPersonExpired}
                  component={TransferPersonExpired}
                />
                <Route
                  exact
                  path={ROUTES.mockEvent}
                  component={MockEvent}
                />
                <Route exact path={ROUTES.login} component={Login} />
                <Route
                  exact
                  path={ROUTES.orderProcessed}
                  component={OrderProcessed}
                />
                <Route path={ROUTES.sales} component={Sales} />
                <Route
                  exact
                  path={ROUTES.scheduleManager}
                  component={ScheduleManager}
                />
                <Route
                  exact
                  path={ROUTES.productAddedToCart}
                  component={ProductAddedToCart}
                />
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
                  path={ROUTES.registrationStatus}
                  component={RegistrationStatus}
                />
                <Route
                  exact
                  path={ROUTES.createReport}
                  component={CreateReport}
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
                  path={ROUTES.importMembers}
                  component={ImportMembers}
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
                  path={ROUTES.membersList}
                  component={MembersList}
                />
                <PrivateRoute
                  path={ROUTES.scheduleInteractiveTool}
                  component={ScheduleInteractiveTool}
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
            <SnackBar />
            <BottomNavigation />
          </div>
        </Router>
      </ThemeProvider>
    </Elements>
  );
}
