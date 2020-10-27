const {
  sendMessage: sendMessageHelper,
} = require('../helpers/facebook');

const { setMessengerId } = require('../helpers');
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

module.exports = {
  sendMessage,
  linkMessengerAccountAllIncluded,
  linkMessengerAccount,
};
