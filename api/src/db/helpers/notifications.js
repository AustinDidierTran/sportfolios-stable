const knex = require('../connection');

const createFollowNotification = async (sender_id, target_id) => {
  return knex('notification_follow').insert({
    sender_id,
    target_id,
  });
};

const deleteFollowNotification = async (sender_id, target_id) => {
  return knex('notification_follow')
    .where({ sender_id, target_id })
    .del();
};

const seeFollowNotifications = async (sender_id, target_id) => {
  return knex('notification_follow')
    .update({ seen_at: new Date() })
    .where({ sender_id, target_id });
};

const getAllNotifications = async user_id => {
  const followNotifications = await knex
    .select(
      'nf.sender_id',
      'nf.seen_at',
      'nf.created_at',
      'p.photo_url',
      'p.first_name',
      'p.last_name',
    )
    .from('notification_follow AS nf')
    .leftJoin('persons AS p', 'nf.follower', '=', 'p.persons')
    .where('nf.target_id', user_id)
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
