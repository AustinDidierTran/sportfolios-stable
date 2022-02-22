import { CLIENT_BASE_URL } from '../../../../conf.js';
import { ROUTES_ENUM } from '../../../../common/enums/index.js';

async function formatLinkWithAuthToken(userId, route) {
  // Authentication doesn work this way anymore... just send directly the route
  return `${CLIENT_BASE_URL}${route}`;
}

async function formatFooterLink(userId) {
  const res = await formatLinkWithAuthToken(
    userId,
    `${ROUTES_ENUM.userSettings}#notifications`,
  );
  return res;
}

export { formatLinkWithAuthToken, formatFooterLink };
