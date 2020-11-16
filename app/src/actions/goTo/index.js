import history from '../../stores/history';
import { getFormattedMailTo } from '../../utils/stringFormats';
import api from '../api';

export const ROUTES = {
  addBankAccount: '/addBankAccount',
  addPaymentMethod: '/addPaymentMethod',
  adminPanel: '/adminPanel',
  cart: '/cart',
  checkout: '/checkout',
  confirmationEmailSent: '/confirmationEmailSent/:email',
  confirmEmail: '/confirmEmail/:token',
  confirmEmailFailure: '/ConfirmEmailFailure',
  confirmEmailSuccess: '/confirmEmailSuccess',
  create: '/create',
  createOrganization: '/organization/create',
  createPerson: '/person/create',
  createTeam: '/team/create',
  entity: '/:id',
  entityNotFound: '/entityNotFound',
  event: '/event',
  eventRegistration: '/eventRegistration/:id',
  home: '/',
  login: '/login',
  membersList: '/membersList',
  menu: '/menu',
  mockEvent: '/mock/Event/:openTab',
  notifications: '/notifications',
  orderProcessed: '/orderProcessed',
  organizationList: '/organizationList',
  privacyPolicy: '/privacy',
  productAddedToCart: '/productAddedToCart',
  recoveryEmail: '/recoveryEmail',
  registrationStatus: '/registrationStatus',
  createReport: '/createReport',
  sales: '/sales/:id',
  scheduleInteractiveTool: '/scheduleInteractiveTool/:id',
  scheduleManager: '/scheduleManager',
  search: '/search',
  shopDetails: '/shopDetails/:id/:stripePriceId',
  stripe: '/stripe',
  team: '/team',
  transferPerson: '/transferPerson/:token',
  transferPersonExpired: '/transferPersonExpired',
  userSettings: '/userSettings',
};

export const formatRoute = (route, params, queryParams) => {
  if (!route) {
    /* eslint-disable-next-line */
    console.error('Route is undefined');
  }

  if (!params && !queryParams) {
    return route;
  }

  const withParams = params
    ? Object.keys(params).reduce(
        (prev, curr) => prev.replace(`:${curr}`, params[curr]),
        route,
      )
    : route;

  if (!queryParams) {
    return withParams;
  }

  return Object.keys(queryParams).reduce(
    (prev, key, index) =>
      index === 0
        ? `${prev}?${key}=${queryParams[key]}`
        : `${prev}&${key}=${queryParams[key]}`,
    withParams,
  );
};

export const goTo = (route, params, queryParams) => {
  history.push(formatRoute(route, params, queryParams));
};

export const goToLink = route => {
  history.push(route);
};

export const goToAlias = async (entityId, params, queryParams) => {
  const { data } = await api(
    formatRoute('/api/entity/alias', null, {
      entityId,
    }),
  );
  history.push(formatRoute(data.alias, params, queryParams));
};

export const goToAndReplace = (route, params, queryParams) => {
  history.replace(formatRoute(route, params, queryParams));
};

export const goBack = () => {
  if (history.length) {
    history.goBack();
  } else {
    history.push(ROUTES.home);
  }
};

export const mailTo = (emailsFormatted, subject, message) => {
  document.location.href = getFormattedMailTo(
    emailsFormatted,
    subject,
    message,
  );
};
