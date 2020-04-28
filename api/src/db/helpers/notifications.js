const knex = require('../connection');

const createFollowNotification = async (user_id, target) => {
  return knex('notification_follow').insert({
    user_id: target,
    follower: user_id,
  });
};

const deleteFollowNotification = async (user_id, target) => {
  return knex('notification_follow')
    .where({ user_id: target, follower: user_id })
    .del();
};

const seeFollowNotifications = async (user_id, follower) => {
  return knex('notification_follow')
    .update({ seen_at: new Date() })
    .where({ user_id, follower });
};

const getAllNotifications = async user_id => {
  const followNotifications = await knex
    .select(
      'nf.follower',
      'nf.seen_at',
      'nf.created_at',
      'ui.photo_url',
      'ui.first_name',
      'ui.last_name',
    )
    .from('notification_follow AS nf')
    .leftJoin('user_info AS ui', 'nf.follower', '=', 'ui.user_id')
    .where('nf.user_id', user_id)
    .orderBy('created_at', 'desc');
  return [
    ...followNotifications.map(n => ({ ...n, type: 'follow' })),
  ];
};

module.exports = {
  createFollowNotification,
  deleteFollowNotification,
  getAllNotifications,
  seeFollowNotifications,
};
