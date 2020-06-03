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
    .select('p.user_id', 'p.first_name', 'p.last_name', 'p.photo_url')
    .from('followers')
    .leftJoin('persons AS p', 'followers.target', '=', 'p.user_id')
    .where('followers.sender', sender);
};

module.exports = {
  followAthleteWithId,
  unfollowAthleteWithId,
  getFollowingUsers,
};
