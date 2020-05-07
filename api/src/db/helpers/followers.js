const knex = require('../connection');

const followAthleteWithId = async (sender, target) => {
  return knex('followers').insert({
    sender,
    target,
  });
};

const unfollowAthleteWithId = async (sender, target) => {
  return knex('followers')
    .where({
      sender,
      target,
    })
    .del();
};

const getFollowingUsers = async sender => {
  return knex
    .select(
      followers.target,
      ui.user_id,
      ui.first_name,
      ui.last_name,
      ui.photo_url,
    )
    .from(followers)
    .LeftJoin(
      'user_info AS ui',
      'followers.target',
      '=',
      'ui.user_id',
    )
    .where('followers.sender', sender);
};

module.exports = {
  followAthleteWithId,
  unfollowAthleteWithId,
  getFollowingUsers,
};
