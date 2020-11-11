//The notifications queries must not import any of the other queries to prevent circular dependency
const {
  getNotifications: getNotificationsHelper,
  seeNotifications: seeNotificationsHelper,
  countUnseenNotifications: countUnseenNotificationsHelper,
  clickNotification: clickNotificationHelper,
  deleteNotification: deleteNotificationHelper,
  addNotification,
} = require('../helpers/notifications');

const { sendMail } = require('../../server/utils/nodeMailer');

const emailFactory = require('../emails/emailFactory');
const {
  getEmailsFromUserId,
  getLanguageFromEmail,
  getLanguageFromUser,
} = require('../helpers');

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

const sendNotification = async (notif, emailInfos) => {
  //TODO check for user notification permission
  const { user_id } = notif;
  addNotification(notif);
  if (emailInfos) {
    const emails = await getEmailsFromUserId(user_id);
    const locale = await getLanguageFromUser(user_id);
    if (emails) {
      const { html, subject, text } = await emailFactory({
        ...emailInfos,
        locale,
      });
      emails.forEach(e => {
        const { email, confirmed_email_at } = e;
        if (confirmed_email_at) {
          sendMail({ html, email, subject, text });
        }
      });
    }
  }
};

const getNotifications = async (user_id, body) => {
  return getNotificationsHelper(user_id, body);
};

module.exports = {
  getNotifications,
  seeNotifications,
  countUnseenNotifications,
  clickNotification,
  deleteNotification,
  sendNotification,
};
