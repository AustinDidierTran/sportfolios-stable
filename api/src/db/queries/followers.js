const {
  followAthleteWithId,
  unfollowAthleteWithId,
} = require('../helpers/followers');

const {
  createFollowNotification,
  deleteFollowNotification,
} = require('../helpers/notifications');

const followAthlete = async (userId, query) => {
  await createFollowNotification(userId, query);
  return followAthleteWithId(userId, query);
};

const unfollowAthlete = async (userId, query) => {
  await deleteFollowNotification(userId, query);
  return unfollowAthleteWithId(userId, query);
};

module.exports = {
  followAthlete,
  unfollowAthlete,
};
