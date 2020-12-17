const {
  sendMessage: sendMessageHelper,
  logMessage: logMessageHelper,
} = require('../helpers/facebook');

const {
  setMessengerId,
  getChatbotInfos: getChatbotInfosHelper,
  setChatbotInfos: setChatbotInfosHelper,
  addChatbotId,
  deleteChatbotInfos: deleteChatbotInfosHelper,
} = require('../helpers');

const sendMessage = (messengerId, message) => {
  return sendMessageHelper(messengerId, message);
};

const linkMessengerAccountAllIncluded = async (
  userId,
  messengerId,
) => {
  const res = await setMessengerId(userId, messengerId);
  return Boolean(res);
};

const getChatbotInfos = async messengerId => {
  infos = await getChatbotInfosHelper(messengerId);

  if (!infos) {
    //New messengerId
    infos = await addChatbotId(messengerId);
  }
  return infos;
};

const setChatbotInfos = async (messengerId, infos) => {
  return setChatbotInfosHelper(messengerId, infos);
};

const deleteChatbotInfos = async messengerId => {
  return deleteChatbotInfosHelper(messengerId);
};

const logMessage = async infos => {
  return logMessageHelper(infos);
};

module.exports = {
  sendMessage,
  linkMessengerAccountAllIncluded,
  getChatbotInfos,
  setChatbotInfos,
  deleteChatbotInfos,
  logMessage,
};
