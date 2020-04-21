const {
  getAllNotifications: getAllNotificationsHelper,
  seeFollowNotification: seeFollowNotificationHelper,
} = require('../helpers/notifications');

const seeFollowNotification = async (user_id, query) => {
  return seeFollowNotificationHelper(user_id, query);
};

const getAllNotifications = async user_id => {
  return getAllNotificationsHelper(user_id);
};

module.exports = {
  getAllNotifications,
  seeFollowNotification,
};
