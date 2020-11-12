const knex = require('../connection');
const { attachPaginate } = require('knex-paginate');
attachPaginate();

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
  const res = await knex('notifications')
    .where({ user_id, seen_at: null })
    .count('*')
    .first();
  if (res) {
    return res.count;
  }
};

const seeNotifications = async user_id => {
  return knex('notifications')
    .update({ seen_at: new Date() })
    .where({ user_id, seen_at: null })
    .returning('id');
};

const getNotifications = async (user_id, body) => {
  const { perPage, currentPage } = body;
  let res;
  if (perPage && currentPage) {
    const { data } = await knex('notifications_view')
      .where({ user_id })
      .orderBy('created_at', 'desc')
      .paginate({ perPage, currentPage });
    res = data;
  } else {
    //Get all
    res = await knex('notifications_view')
      .select('*')
      .where({ user_id })
      .orderBy('created_at', 'desc');
  }
  if (res) {
    const map = res.map(notif => {
      const {
        photo_url: photoUrl,
        clicked_at,
        ...otherProps
      } = notif;
      return {
        photoUrl,
        clicked: Boolean(clicked_at),
        ...otherProps,
      };
    });
    return map;
  }
};

module.exports = {
  getNotifications,
  seeNotifications,
  countUnseenNotifications,
  clickNotification,
  deleteNotification,
  addNotification,
};
