const {
  followAthleteWithId,
  unfollowAthleteWithId,
} = require('../helpers/followers');

const {
  createFollowNotification,
  deleteFollowNotification,
} = require('../helpers/notifications');

const followAthlete = async (user_id, query) => {
  console.log('user_id', user_id);
  console.log('query', query);

  await createFollowNotification(user_id, query);
  return followAthleteWithId(user_id, query);
};

const unfollowAthlete = async (user_id, query) => {
  console.log('unfollow');

  console.log('user_id', user_id);
  console.log('query', query);
  await deleteFollowNotification(user_id, query);
  return unfollowAthleteWithId(user_id, query);
};

module.exports = {
  followAthlete,
  unfollowAthlete,
};
