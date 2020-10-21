const {
  getMessengerIdFromFbID,
  sendMessage: sendMessageHelper,
} = require('../helpers/facebook');

const sendMessage = (messengerId, message) => {
  return sendMessageHelper(messengerId, message);
};

module.exports = {
  sendMessage,
};
