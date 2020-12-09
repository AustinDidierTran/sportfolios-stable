const { CLIENT_BASE_URL } = require('../../../../conf');
const { generateAuthToken } = require('../helpers');
const {
  formatRoute,
} = require('../../../../common/utils/stringFormat');
const { ROUTES_ENUM } = require('../../../../common/enums');

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

module.exports = { formatLinkWithAuthToken };
