const { CLIENT_BASE_URL } = require('../../../../conf');
const {
  formatRoute,
} = require('../../../../common/utils/stringFormat');
const { ROUTES_ENUM } = require('../../../../common/enums');
const { generateAuthToken } = require('../helpers/entity');

const formatLinkWithAuthToken = async (userId, route) => {
  const token = await generateAuthToken(userId);
  const link = formatRoute(
    CLIENT_BASE_URL + '/page' + ROUTES_ENUM.redirectWithToken,
    null,
    {
      token,
      url: encodeURIComponent(route),
    },
  );
  return link;
};

module.exports = { formatLinkWithAuthToken };
