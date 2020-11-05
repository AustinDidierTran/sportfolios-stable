const {
  getAllNotifications: getAllNotificationsHelper,
  seeNotifications: seeNotificationsHelper,
  countUnseenNotifications: countUnseenNotificationsHelper,
  clickNotification: clickNotificationHelper,
  deleteNotification: deleteNotificationHelper,
} = require('../helpers/notifications');

const seeNotifications = async user_id => {
  return seeNotificationsHelper(user_id);
};

const countUnseenNotifications = async user_id => {
  return countUnseenNotificationsHelper(user_id);
};

const clickNotification = async notification_id => {
  return clickNotificationHelper(notification_id);
};

const deleteNotification = async notification_id => {
  return deleteNotificationHelper(notification_id);
};

const getAllNotifications = async user_id => {
  return getAllNotificationsHelper(user_id);
};

module.exports = {
  getAllNotifications,
  seeNotifications,
  countUnseenNotifications,
  clickNotification,
  deleteNotification,
};
