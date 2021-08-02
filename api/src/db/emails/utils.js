const { CLIENT_BASE_URL } = require('../../../../conf');
const {
  formatRoute,
} = require('../../../../common/utils/stringFormat');
const { ROUTES_ENUM } = require('../../../../common/enums');
const { generateAuthToken } = require('../queries/utils');

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

module.exports = { formatLinkWithAuthToken, formatFooterLink };
