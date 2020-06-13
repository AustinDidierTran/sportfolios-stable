import history from '../../stores/history';

export const ROUTES = {
  adminPanel: '/adminPanel',
  confirmationEmailSent: '/confirmationEmailSent/:email',
  confirmEmail: '/confirmEmail/:token',
  confirmEmailFailure: '/ConfirmEmailFailure',
  confirmEmailSuccess: '/confirmEmailSuccess',
  entity: '/:id',
  entityNotFound: '/entityNotFound',
  event: '/event',
  forgotPassword: '/forgotPassword',
  home: '/',
  login: '/login',
  mockEvent: '/mock/Event/:openTab',
  notifications: '/notifications',
  createOrganization: '/organization/create',
  organizationList: '/organizationList',
  recoveryEmail: '/recoveryEmail/:token',
  search: '/search/:query',
  stripe: '/stripe',
  signup: '/signup',
  team: '/team',
  userSettings: '/userSettings',
  menu: '/menu',
};

export const formatRoute = (route, params = {}, queryParams = {}) => {
  if (!params) {
    return route;
  }

  if (!route) {
    /* eslint-disable-next-line */
    console.error('Route is undefined');
  }

  const withParams = Object.keys(params).reduce(
    (prev, curr) => prev.replace(`:${curr}`, params[curr]),
    route,
  );

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
