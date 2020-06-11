import history from '../../stores/history';

export const ROUTES = {
  adminPanel: '/adminPanel',
  confirmationEmailSent: '/confirmationEmailSent/:email',
  confirmEmail: '/confirmEmail/:token',
  confirmEmailFailure: '/ConfirmEmailFailure',
  confirmEmailSuccess: '/confirmEmailSuccess',
  event: '/event',
  forgotPassword: '/forgotPassword',
  home: '/',
  login: '/login',
  mockOrganization: '/mock/Organization/:openTab',
  mockSelfProfile: '/mock/selfProfile',
  mockEvent: '/mock/Event/:openTab',
  notifications: '/notifications',
  createOrganization: '/organization/create',
  organizationNotFound: '/organizationNotFound',
  organization: '/organization/:id',
  organizationList: '/organizationList',
  profile: '/profile/:id',
  recoveryEmail: '/recoveryEmail/:token',
  search: '/search/:query',
  signup: '/signup',
  team: '/team',
  userSettings: '/userSettings',
  menu: '/menu',
};

export const formatRoute = (route, params = {}, queryParams = {}) => {
  if (!params) {
    return route;
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
