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

module.exports = {
  followAthleteWithId,
  unfollowAthleteWithId,
};
