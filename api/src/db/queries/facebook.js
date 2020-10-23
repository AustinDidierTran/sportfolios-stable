const {
  sendMessage: sendMessageHelper,
} = require('../helpers/facebook');

const { setMessengerId } = require('../helpers');
const { MESSENGER_MESSAGES_FR } = require('../../../../common/enums');

const sendMessage = (messengerId, message) => {
  return sendMessageHelper(messengerId, message);
};

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

module.exports = {
  sendMessage,
  linkMessengerAccountAllIncluded,
};
