import history from '../../stores/history';

export const ROUTES = {
  adminPanel: '/adminPanel',
  confirmationEmailSent: '/confirmationEmailSent/:email',
  confirmEmail: '/confirmEmail/:token',
  confirmEmailFailure: '/ConfirmEmailFailure',
  confirmEmailSuccess: '/confirmEmailSuccess',
  createOrganization: '/organization/create',
  createPerson: '/person/create',
  createTeam: '/team/create',
  entity: '/:id',
  entityNotFound: '/entityNotFound',
  event: '/event',
  forgotPassword: '/forgotPassword',
  home: '/',
  login: '/login',
  memberships: '/memberships',
  menu: '/menu',
  mockEvent: '/mock/Event/:openTab',
  notifications: '/notifications',
  organizationList: '/organizationList',
  recoveryEmail: '/recoveryEmail/:token',
  search: '/search',
  signup: '/signup',
  stripe: '/stripe',
  team: '/team',
  userSettings: '/userSettings',
  cart: '/cart/:id',
};

export const formatRoute = (route, params, queryParams) => {
  if (!params && !queryParams) {
    return route;
  }

  if (!route) {
    /* eslint-disable-next-line */
    console.error('Route is undefined');
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
