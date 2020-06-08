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
  organizationSettings: '/organization/settings/:id',
  profile: '/profile/:id',
  recoveryEmail: '/recoveryEmail/:token',
  search: '/search/:query',
  signup: '/signup',
  team: '/team',
  userSettings: '/userSettings',
  menu: '/menu',
};

export const formatRoute = (route, params) => {
  if (!params) {
    return route;
  }

  const paramKeys = Object.keys(params);

  return paramKeys.reduce(
    (prev, curr) => prev.replace(`:${curr}`, params[curr]),
    route,
  );
};

export const goTo = (route, params) => {
  history.push(formatRoute(route, params));
};
