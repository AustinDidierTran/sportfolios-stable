const knex = require('../connection');

const addNotification = async infos => {
  return knex('notifications').insert(infos);
};

const deleteNotification = async notification_id => {
  return knex('notifications')
    .where({
      id: notification_id,
    })
    .del();
};

const clickNotification = async notification_id => {
  return knex('notifications')
    .where({
      id: notification_id,
    })
    .update({ clicked_at: new Date() });
};

const countUnseenNotifications = async user_id => {
  return knex('notifications')
    .where({ user_id, seen_at: null })
    .count('*');
};

const seeNotifications = async user_id => {
  return knex('notifications_view')
    .update({ seen_at: new Date() })
    .where({ user_id });
};

const getAllNotifications = async user_id => {
  return knex('notifications_view')
    .select('*')
    .where({ user_id });
};

module.exports = {
  getAllNotifications,
  seeNotifications,
  countUnseenNotifications,
  clickNotification,
  deleteNotification,
  addNotification,
};
