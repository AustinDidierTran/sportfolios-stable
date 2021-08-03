const {
  sendMessage: sendMessageHelper,
  logMessage: logMessageHelper,
  getMessengerIdFromFbID,
  setMessengerId,
  getChatbotInfos: getChatbotInfosHelper,
  setChatbotInfos: setChatbotInfosHelper,
  addChatbotId,
  deleteChatbotInfos: deleteChatbotInfosHelper,
  setFacebookData: setFacebookDataHelper,
  deleteMessengerId,
  getMessengerId,
  getFacebookId,
  deleteFacebookId,
  isLinkedFacebookAccount,
} = require('../../db/queries/facebook');

const i18n = require('../../i18n.config');
const Response = require('../utils/ChatBot/response');
const { BASIC_CHATBOT_STATES } = require('../../../../common/enums');
const { ERROR_ENUM } = require('../../../../common/errors');

const sendMessage = (messengerId, message) => {
  return sendMessageHelper(messengerId, message);
};

const setFacebookData = (userId, data) => {
  return setFacebookDataHelper(userId, data);
};

const linkFacebook = async (userId, data) => {
  const { facebook_id } = data;
  if (!facebook_id) {
    return;
  }
  if (await isLinkedFacebookAccount(facebook_id)) {
    throw Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return setFacebookDataHelper(userId, data);
};

const unlinkFacebook = userId => {
  return deleteFacebookId(userId);
};

const linkMessengerAccountAllIncluded = async (
  userId,
  messengerId,
) => {
  const res = await setMessengerId(userId, messengerId);
  return Boolean(res);
};

const getConnectedApps = async userId => {
  const facebookId = await getFacebookId(userId);
  const facebook = {
    connected: Boolean(facebookId),
    id: facebookId,
  };
  const messengerId = await getMessengerId(userId);
  const messenger = {
    connected: Boolean(messengerId),
    id: messengerId,
  };
  let apps = {};
  apps.facebook = facebook;
  apps.messenger = messenger;
  return apps;
};

const linkMessengerFromFBId = async (userId, facebook_id) => {
  const messengerId = await getMessengerIdFromFbID(facebook_id);
  if (!messengerId) {
    throw new Error(ERROR_ENUM.VALUE_IS_INVALID);
  }
  sendMessage(
    messengerId,
    Response.genText(i18n.__('connection.success')),
  );
  setChatbotInfos(messengerId, { state: BASIC_CHATBOT_STATES.HOME });
  return setMessengerId(userId, messengerId);
};

const unlinkMessenger = async userId => {
  return deleteMessengerId(userId);
};

const getChatbotInfos = async messengerId => {
  let infos = await getChatbotInfosHelper(messengerId);

  if (!infos) {
    //New messengerId
    infos = await addChatbotId(messengerId);
  }
  return infos;
};

const setChatbotInfos = (messengerId, infos) => {
  return setChatbotInfosHelper(messengerId, infos);
};

const deleteChatbotInfos = messengerId => {
  return deleteChatbotInfosHelper(messengerId);
};

const logMessage = infos => {
  return logMessageHelper(infos);
};

module.exports = {
  deleteChatbotInfos,
  getChatbotInfos,
  getConnectedApps,
  linkFacebook,
  linkMessengerAccountAllIncluded,
  linkMessengerFromFBId,
  logMessage,
  sendMessage,
  setChatbotInfos,
  setFacebookData,
  unlinkFacebook,
  unlinkMessenger,
};
