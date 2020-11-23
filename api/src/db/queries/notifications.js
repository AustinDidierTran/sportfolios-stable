//The notifications queries must not import any of the other queries to prevent circular dependency
const {
  getNotifications: getNotificationsHelper,
  seeNotifications: seeNotificationsHelper,
  countUnseenNotifications: countUnseenNotificationsHelper,
  clickNotification: clickNotificationHelper,
  deleteNotification: deleteNotificationHelper,
  addNotification,
  getNotificationsSettings: getNotificationsSettingsHelper,
  upsertNotificationsSettings,
} = require('../helpers/notifications');

const socket = require('../../server/websocket/socket.io');

const { sendMail } = require('../../server/utils/nodeMailer');

const emailFactory = require('../emails/emailFactory');
const {
  getEmailsFromUserId,
  getLanguageFromUser,
  getMessengerId,
} = require('../helpers');

const { SOCKET_EVENT } = require('../../../../common/enums');

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
  const { user_id, type } = notif;
  await addNotification(notif);
  const unseenCount = await countUnseenNotifications(user_id);
  socket.emit(SOCKET_EVENT.NOTIFICATIONS, user_id, unseenCount);

  //TODO check for chatbot permissison and send message
  const notifSetting = await getNotificationsSettingsHelper(
    user_id,
    type,
  );
  if (emailInfos && (!notifSetting || notifSetting.email)) {
    sendEmailNotification(user_id, emailInfos);
  }
};

const sendEmailNotification = async (userId, emailInfos) => {
  const emails = await getEmailsFromUserId(userId);
  const locale = await getLanguageFromUser(userId);
  if (emails) {
    const fullEmail = await emailFactory({
      ...emailInfos,
      locale,
    });
    if (!fullEmail) {
      return;
    }
    const { html, subject, text } = fullEmail;
    emails.forEach(e => {
      const { email, confirmed_email_at } = e;
      if (confirmed_email_at) {
        sendMail({ html, email, subject, text });
      }
    });
  }
};

const getNotifications = async (user_id, body) => {
  return getNotificationsHelper(user_id, body);
};

const getNotificationsSettings = async userId => {
  const messengerLinked = Boolean(await getMessengerId(userId));
  return {
    chatbotDisabled: !messengerLinked,
    notifications: await getNotificationsSettingsHelper(userId),
  };
};

const setNotificationsSettings = async (userId, body) => {
  return upsertNotificationsSettings(userId, body);
};

module.exports = {
  getNotifications,
  seeNotifications,
  countUnseenNotifications,
  clickNotification,
  deleteNotification,
  sendNotification,
  getNotificationsSettings,
  setNotificationsSettings,
};
