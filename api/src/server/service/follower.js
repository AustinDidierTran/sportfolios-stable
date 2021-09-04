import { followAthleteWithId, unfollowAthleteWithId } from '../../db/queries/follower.js';

const followAthlete = async (userId, query) => {
  return followAthleteWithId(userId, query);
};

const unfollowAthlete = async (userId, query) => {
  return unfollowAthleteWithId(userId, query);
};

export {
  followAthlete,
  unfollowAthlete,
};
