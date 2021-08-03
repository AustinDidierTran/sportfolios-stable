const {
  followAthleteWithId,
  unfollowAthleteWithId,
} = require('../../db/queries/follower');

const {
  createFollowNotification,
  deleteFollowNotification,
} = require('../../db/queries/notification');

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
