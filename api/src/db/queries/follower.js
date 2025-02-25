import knex from '../connection.js';

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
    .select('entities.id', 'name', 'surname', 'photo_url')
    .from('followers')
    .leftJoin(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'entities.id',
    )
    .leftJoin('entities', 'followers.target', '=', 'entities.id')
    .where('followers.sender', sender);
};

export {
  followAthleteWithId,
  unfollowAthleteWithId,
  getFollowingUsers,
};
