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
} = require('../../db/queries/notification');

const Chatbot = require('../utils/ChatBot/chatbot');

const socket = require('../websocket/socket.io');

const {
  sendMail,
  sendAddedToEventEmail,
  sendAddedToTeamEmail,
  sendPersonRegistrationEmail,
  sendPersonRefusedRegistrationEmail,
  sendPersonPendingRegistrationEmailToAdmin,
  sendPersonRegistrationEmailToAdmin,
  sendTeamUnregisteredEmail,
  sendTeamAcceptedRegistrationEmail,
  sendTeamPendingRegistrationEmailToAdmin,
  sendTeamRegistrationEmailToAdmin,
  sendTeamRefusedRegistrationEmail,
  sendImportMemberEmail,
  sendOtherTeamSubmittedScore,
} = require('../utils/nodeMailer');

const {
  getEmailFromUserId,
  getLanguageFromUser,
  getMessengerId,
  setChatbotInfos,
  getChatbotInfos,
} = require('../../db/queries/user');
const { getGameTeams } = require('../../db/queries/entity');

const {
  SOCKET_EVENT,
  NOTIFICATION_TYPE,
  SCORE_SUBMISSION_CHATBOT_STATES,
  MILLIS_TIME_ENUM,
  BASIC_CHATBOT_STATES,
} = require('../../../../common/enums');
const { getEmailsLandingPage } = require('./admin');

const seeNotifications = async userId => {
  return seeNotificationsHelper(userId);
};

const countUnseenNotifications = async userId => {
  return countUnseenNotificationsHelper(userId);
};

const clickNotification = async notification_id => {
  return clickNotificationHelper(notification_id);
};

const deleteNotification = async notification_id => {
  return deleteNotificationHelper(notification_id);
};

//This is the notification manager
const sendNotification = async (type, userId, infos) => {
  // Get notification Settings
  const notifSetting = await getNotificationsSettingsHelper(
    userId,
    type,
  );
  if (infos && (!notifSetting || notifSetting.in_app)) {
    await sendInAppNotification(type, userId, infos);
    const unseenCount = await countUnseenNotifications(userId);
    socket.emit(SOCKET_EVENT.NOTIFICATIONS, userId, unseenCount);
  }

  if (infos && (!notifSetting || notifSetting.email)) {
    await sendEmailNotification(type, userId, infos);
  }

  if (infos && (!notifSetting || notifSetting.chatbot)) {
    await sendChatbotNotification(type, userId, infos);
  }
};

const sendEmailNotification = async (type, userId, infos) => {
  const email = await getEmailFromUserId(userId);
  const language = await getLanguageFromUser(userId);
  switch (type) {
    case NOTIFICATION_TYPE.ADDED_TO_EVENT: {
      const { team, name, event } = infos;
      sendAddedToEventEmail({
        email,
        teamName: team.name,
        senderName: name,
        language,
        eventName: event.name,
        eventId: event.id,
        userId,
      });
      break;
    }
    case NOTIFICATION_TYPE.ADDED_TO_TEAM: {
      const { team } = infos;
      sendAddedToTeamEmail({
        email,
        language,
        teamName: team.name,
        teamId: team.id,
        userId,
      });
      break;
    }
    case NOTIFICATION_TYPE.PERSON_REGISTRATION: {
      const { event, person, isFreeOption } = infos;
      sendPersonRegistrationEmail({
        email,
        language,
        event,
        person,
        isFreeOption,
        userId,
      });
      break;
    }
    case NOTIFICATION_TYPE.PERSON_REGISTRATION_TO_ADMIN: {
      const { person, event, placesLeft } = infos;
      sendPersonRegistrationEmailToAdmin({
        email,
        person,
        event,
        placesLeft,
        language,
        userId,
      });
      break;
    }
    case NOTIFICATION_TYPE.PERSON_PENDING_REGISTRATION_TO_ADMIN: {
      const { person, event, placesLeft } = infos;
      sendPersonPendingRegistrationEmailToAdmin({
        email,
        person,
        event,
        language,
        placesLeft,
        userId,
      });
      break;
    }
    case NOTIFICATION_TYPE.PERSON_REFUSED_REGISTRATION: {
      const { event, person } = infos;
      sendPersonRefusedRegistrationEmail({
        email,
        person,
        event,
        language,
      });
      break;
    }
    case NOTIFICATION_TYPE.TEAM_REGISTRATION: {
      const { team, event, isFreeOption } = infos;
      sendTeamAcceptedRegistrationEmail({
        language,
        team,
        event,
        email,
        isFreeOption,
        userId,
      });
      break;
    }
    case NOTIFICATION_TYPE.TEAM_REGISTRATION_TO_ADMIN: {
      const { team, event, placesLeft } = infos;
      sendTeamRegistrationEmailToAdmin({
        email,
        team,
        event,
        language,
        placesLeft,
        userId,
      });
      break;
    }
    case NOTIFICATION_TYPE.TEAM_REFUSED_REGISTRATION: {
      const { team, event } = infos;
      sendTeamRefusedRegistrationEmail({
        email,
        team,
        event,
        language,
      });
      break;
    }
    case NOTIFICATION_TYPE.TEAM_PENDING_REGISTRATION_ADMIN: {
      const { team, event, placesLeft } = infos;
      sendTeamPendingRegistrationEmailToAdmin({
        email,
        team,
        event,
        language,
        placesLeft,
        userId,
      });
      break;
    }
    case NOTIFICATION_TYPE.TEAM_UNREGISTERED: {
      const { team, event, status } = infos;
      sendTeamUnregisteredEmail({
        language,
        email,
        team,
        event,
        status,
        userId,
      });
      break;
    }
    case NOTIFICATION_TYPE.IMPORT_MEMBER: {
      const { token, organizationName } = infos;
      sendImportMemberEmail({
        email,
        token,
        language,
        organizationName,
        userId,
      });
      break;
    }
    case NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE: {
      const { score, gameId, eventId, submittedBy, eventName, myRosterId } = infos;
      sendOtherTeamSubmittedScore({
        email,
        score,
        gameId,
        eventId,
        language,
        userId,
        submittedBy,
        eventName,
        myRosterId,
      });
      break;
    }
  }
};

const sendInAppNotification = async (type, userId, infos) => {
  switch (type) {
    case NOTIFICATION_TYPE.ADDED_TO_EVENT: {
      const { event, team } = infos;
      const notif = {
        user_id: userId,
        type: NOTIFICATION_TYPE.ADDED_TO_EVENT,
        entity_photo: event.id || team.id,
        metadata: {
          eventId: event.id,
          eventName: event.name,
          teamName: team.name,
        },
      };
      addNotification(notif);
      break;
    }
    case NOTIFICATION_TYPE.ADDED_TO_TEAM: {
      const { team } = infos;
      const notif = {
        user_id: userId,
        type: NOTIFICATION_TYPE.ADDED_TO_TEAM,
        entity_photo: team.id,
        metadata: {
          teamId: team.id,
          teamName: team.name,
        },
      };
      addNotification(notif);
      break;
    }
    case NOTIFICATION_TYPE.REQUEST_TO_JOIN_TEAM: {
      const { team, person } = infos;
      const notif = {
        user_id: userId,
        type: NOTIFICATION_TYPE.REQUEST_TO_JOIN_TEAM,
        entity_photo: team.id,
        metadata: {
          teamId: team.id,
          teamName: team.name,
          personName: person.name,
          personSurname: person.surname,
        },
      };
      addNotification(notif);
      break;
    }
    case NOTIFICATION_TYPE.SCORE_SUBMISSION_CONFLICT: {
      const notif = {
        user_id: userId,
        type: NOTIFICATION_TYPE.SCORE_SUBMISSION_CONFLICT,
        entity_photo: infos.eventId,
        metadata: infos,
      };
      addNotification(notif);
      break;
    }
    case NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE: {
      const notif = {
        user_id: userId,
        type: NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE,
        entity_photo: infos.eventId,
        metadata: infos,
      };
      addNotification(notif);
      break;
    }
  }
};

const sendChatbotNotification = async (type, userId, infos) => {
  const messengerId = await getMessengerId(userId);
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
  let newState;
  switch (type) {
    case NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST: {
      newState =
        SCORE_SUBMISSION_CHATBOT_STATES.SCORE_SUBMISSION_REQUEST_SENT;
      const { gameId, playerId, eventId } = infos;
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
      break;
    }
    case NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE: {
      newState =
        SCORE_SUBMISSION_CHATBOT_STATES.OTHER_TEAM_SUBMITTED_A_SCORE;
      const {
        gameId,
        eventId,
        eventName,
        myRosterId,
        myPlayerId,
        submittedBy,
      } = infos;
      const score = JSON.parse(infos.score);
      const rostersId = Object.keys(score);
      const names = await getRostersNames(rostersId);
      const myTeam = [
        names.splice(
          names.findIndex(n => {
            return n.roster_id == myRosterId;
          }),
          1,
        ),
      ];
      chatbotInfos.myTeamName = myTeam.name;
      chatbotInfos.myScore = score[myRosterId];
      delete names[myRosterId];
      chatbotInfos.opponentTeams = names.map(team => {
        const { roster_id, name } = team;
        return {
          rosterId: roster_id,
          score: score[roster_id],
          teamName: name,
        };
      }, {});
      chatbotInfos.submittedBy = names.find(
        n => n.roster_id == submittedBy,
      ).name;
      chatbotInfos.gameId = gameId;
      chatbotInfos.eventName = eventName;
      chatbotInfos.myRosterId = myRosterId;
      chatbotInfos.playerId = myPlayerId;
      chatbotInfos.eventId = eventId;
      break;
    }
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

const sendMessageToSportfoliosAdmin = async body => {
  const { name, email, message } = body;

  const emails = await getEmailsLandingPage();

  const subject = `Landing page message`;

  const text = `${name} vous à envoyé un message à partir de l'adresse courriel suivante:  ${email}. \n\n Voici le message: \n\n ${message}`;

  sendMail({ email: emails, subject, text });

  const senderSubject = `Confirmation d'envoi`;

  const senderText = `Votre message à bien été envoyé à Sportfolios. \n\n Voici le contenu de votre message: \n\n ${message}`;

  sendMail({ email, subject: senderSubject, text: senderText });

  return email;
};

const getNotifications = async (userId, body) => {
  return getNotificationsHelper(userId, body);
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
  sendMessageToSportfoliosAdmin,
  getNotificationsSettings,
  setNotificationsSettings,
};
