const {
  sendMessage: sendMessageHelper,
} = require('../helpers/facebook');

const {
  setMessengerId,
  getChatbotInfos: getChatbotInfosHelper,
  setChatbotInfos: setChatbotInfosHelper,
  addChatbotId,
} = require('../helpers');
const { MESSENGER_MESSAGES_FR } = require('../../../../common/enums');

const sendMessage = (messengerId, message) => {
  return sendMessageHelper(messengerId, message);
};

//TODO Remove this function
const linkMessengerAccountAllIncluded = async (
  userId,
  messengerId,
) => {
  const res = await setMessengerId(userId, messengerId);
  if (res) {
    sendMessageHelper(
      messengerId,
      MESSENGER_MESSAGES_FR.CONNECTION_SUCCESS,
    );
  } else {
    sendMessageHelper(
      messengerId,
      MESSENGER_MESSAGES_FR.CONNECTION_ERROR,
    );
  }
};

const linkMessengerAccount = async (userId, messengerId) => {
  return setMessengerId(userId, messengerId);
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

module.exports = {
  sendMessage,
  linkMessengerAccountAllIncluded,
  linkMessengerAccount,
  getChatbotInfos,
  setChatbotInfos,
};
