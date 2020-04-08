import history from '../../stores/history';

export const ROUTES = {
  adminPanel: '/adminPanel',
  confirmationEmailSent: '/confirmationEmailSent/:email',
  confirmEmail: '/confirmEmail/:token',
  confirmEmailFailure: '/ConfirmEmailFailure',
  confirmEmailSuccess: '/confirmEmailSuccess',
  forgotPassword: '/forgotPassword',
  login: '/login',
  recoveryEmail: '/recoveryEmail/:token',
  signup: '/signup',
  userSettings: '/userSettings'
}

export const formatRoute = (route, params) => {
  if (!params) {
    return route;
  }

  const paramKeys = Object.keys(params);

  return paramKeys.reduce((prev, curr) => prev.replace(`:${curr}`, params[curr]), route);
}

export const goTo = (route, params) => {
  history.push(formatRoute(route, params));
}