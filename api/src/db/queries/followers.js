const {
  followAthleteWithId,
  unfollowAthleteWithId,
} = require('../helpers/followers');

const followAthlete = async (user_id, query) => {
  return followAthleteWithId(user_id, query);
};

const unfollowAthlete = async (user_id, query) => {
  return unfollowAthleteWithId(user_id, query);
};

module.exports = {
  followAthlete,
  unfollowAthlete,
};
