import { CLIENT_BASE_URL } from '../../../../conf.js';
import { formatRoute } from '../../../../common/utils/stringFormat.js';
import { ROUTES_ENUM } from '../../../../common/enums/index.js';
import { generateAuthToken } from '../queries/utils.js';

async function formatLinkWithAuthToken(userId, route) {
  const token = await generateAuthToken(userId);
  const link = formatRoute(
    CLIENT_BASE_URL + ROUTES_ENUM.redirectWithToken,
    null,
    {
      token,
      url: encodeURIComponent(route),
    },
  );
  return link;
}

async function formatFooterLink(userId) {
  const res = await formatLinkWithAuthToken(
    userId,
    `${ROUTES_ENUM.userSettings}#notifications`,
  );
  return res;
}

export { formatLinkWithAuthToken, formatFooterLink };
