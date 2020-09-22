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
      'ep.photo_url',
      'en.name',
      'en.surname',
    )
    .from('notification_follow AS nf')
    .leftJoin(
      'entities_name AS en',
      'nf.sender_id',
      '=',
      'en.entity_id',
    )
    .leftJoin(
      'entities_photo AS ep',
      'nf.sender_id',
      '=',
      'ep.entity_id',
    )
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
