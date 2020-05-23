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
  organization: '/organization',
  profile: '/profile/:id',
  recoveryEmail: '/recoveryEmail/:token',
  search: '/search/:query',
  signup: '/signup',
  team: '/team/:teamId',
  userSettings: '/userSettings',
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
