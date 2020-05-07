const {
  getFollowingUsers: getFollowingUsersHelper,
} = require('../helpers/followers');

const getFollowingUsers = async (user_id, query) => {
  return getFollowingUsersHelper(user_id, query);
};

module.exports = {
  getFollowingUsers,
};
