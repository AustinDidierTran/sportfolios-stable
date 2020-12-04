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
  getRostersNames,
} = require('../helpers/notifications');

const Chatbot = require('../../server/utils/ChatBot/chatbot');

const socket = require('../../server/websocket/socket.io');

const { sendMail } = require('../../server/utils/nodeMailer');

const emailFactory = require('../emails/emailFactory');
const {
  getEmailsFromUserId,
  getLanguageFromUser,
  getMessengerId,
  setChatbotInfos,
  getChatbotInfos,
} = require('../helpers');
const { getGameTeams } = require('../helpers/entity');

const {
  SOCKET_EVENT,
  NOTIFICATION_TYPE,
  SCORE_SUBMISSION_CHATBOT_STATES,
  MILLIS_TIME_ENUM,
  BASIC_CHATBOT_STATES,
} = require('../../../../common/enums');

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

  const notifSetting = await getNotificationsSettingsHelper(
    user_id,
    type,
  );
  if (emailInfos && (!notifSetting || notifSetting.email)) {
    sendEmailNotification(user_id, emailInfos);
  }
  if (!notifSetting || notifSetting.chatbot) {
    sendChatbotNotification(user_id, notif);
  }
};

const sendChatbotNotification = async (user_id, notif) => {
  const messengerId = await getMessengerId(user_id);
  if (!messengerId) {
    return;
  }
  const { chatbotInfos, updated_at, state } = await getChatbotInfos(
    messengerId,
  );
  //Check if state is not at home, or if no interaction has been made with the bot in past hours to prevent interruptin a conversation
  if (
    state != BASIC_CHATBOT_STATES.HOME &&
    new Date(updated_at).valueOf() >
      new Date().valueOf() - MILLIS_TIME_ENUM.ONE_HOUR * 3
  ) {
    return;
  }
  const { type, metadata } = notif;
  let newState;
  if (type === NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST) {
    newState =
      SCORE_SUBMISSION_CHATBOT_STATES.SCORE_SUBMISSION_REQUEST_SENT;
    const { gameId, playerId, eventId } = metadata;
    const teams = await getGameTeams(gameId, playerId);
    let myTeamFound = false;
    chatbotInfos.opponentTeams = [];
    chatbotInfos.gameId = gameId;
    chatbotInfos.playerId = playerId;
    chatbotInfos.eventId = eventId;
    teams.forEach(team => {
      if (!myTeamFound && team.player_id) {
        myTeamFound = true;
        chatbotInfos.myRosterId = team.roster_id;
        chatbotInfos.myTeamName = team.name;
      } else {
        chatbotInfos.opponentTeams.push({
          rosterId: team.roster_id,
          teamName: team.name,
        });
      }
    });
  } else if (
    type === NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE
  ) {
    newState =
      SCORE_SUBMISSION_CHATBOT_STATES.OTHER_TEAM_SUBMITTED_A_SCORE;
    const {
      suggestionId,
      eventName,
      myRosterId,
      myPlayerId,
      submittedBy,
    } = metadata;
    const score = JSON.parse(metadata.score);
    const rostersId = Object.keys(score);
    const names = await getRostersNames(rostersId);
    const myTeam = names.find(n => n.roster_id == myRosterId);
    chatbotInfos.myTeamName = myTeam.name;
    delete names[myRosterId];
    chatbotInfos.opponentTeams = names.reduce((acc, curr) => {
      const { roster_id, name } = curr;
      acc[roster_id] = { score: score[roster_id], teamName: name };
      return acc;
    }, {});
    console.log({ submittedBy });
    console.log(names);
    chatbotInfos.submittedBy = names.find(
      n => n.roster_id == submittedBy,
    ).name;
    chatbotInfos.suggestionId = suggestionId;
    chatbotInfos.eventName = eventName;
    chatbotInfos.myRosterId = myRosterId;
    chatbotInfos.playerId = myPlayerId;
  }
  //Sending the notif and updating db
  if (newState) {
    const chatbot = new Chatbot(messengerId, newState, chatbotInfos);
    chatbot.sendIntroMessages();
    await setChatbotInfos(messengerId, {
      chatbot_infos: JSON.stringify(chatbot.chatbotInfos),
      state: chatbot.stateType,
    });
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
