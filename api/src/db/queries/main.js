const {
  getFollowingUsers: getFollowingUsersHelper,
} = require('../helpers/followers');

const getAllMainInformations = async user_id => {
  const users = await getFollowingUsersHelper(user_id);

  return { users };
};

module.exports = {
  getAllMainInformations,
};
