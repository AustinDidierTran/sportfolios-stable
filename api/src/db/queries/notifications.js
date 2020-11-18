//The notifications queries must not import any of the other queries to prevent circular dependency
const {
  getNotifications: getNotificationsHelper,
  seeNotifications: seeNotificationsHelper,
  countUnseenNotifications: countUnseenNotificationsHelper,
  clickNotification: clickNotificationHelper,
  deleteNotification: deleteNotificationHelper,
  addNotification,
  getNotificationsSettings: getNotificationsSettingsHelper,
  editEmailNotificationSetting: editEmailNotificationSettingHelper,
  editChatbotNotificationSetting: editChatbotNotificationSettingHelper,
} = require('../helpers/notifications');

const socket = require('../../server/websocket/socket.io');

const { sendMail } = require('../../server/utils/nodeMailer');

const emailFactory = require('../emails/emailFactory');
const {
  getEmailsFromUserId,
  getLanguageFromUser,
  getMessengerId,
} = require('../helpers');
const { NOTIFICATION_MEDIA } = require('../../../../common/enums');

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
  const notifSettings = await getNotificationsSettingsHelper(
    user_id,
    type,
  );
  if (emailInfos && notifSettings && notifSettings.email) {
    sendEmailNotification(user_id, emailInfos);
  }
};

const sendEmailNotification = async (userId, emailInfos) => {
  const emails = await getEmailsFromUserId(userId);
  const locale = await getLanguageFromUser(userId);
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

const setNotificationsSettings = async (
  userId,
  { type, media, enabled },
) => {
  if (media === NOTIFICATION_MEDIA.EMAIL) {
    return editEmailNotificationSettingHelper(userId, {
      type,
      enabled,
    });
  }
  if (media === NOTIFICATION_MEDIA.CHATBOT) {
    return editChatbotNotificationSettingHelper(userId, {
      type,
      enabled,
    });
  }
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
