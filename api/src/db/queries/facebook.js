const {
  sendMessage: sendMessageHelper,
} = require('../helpers/facebook');

const { setMessengerId } = require('../helpers');

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
      "You have been sign up to Sportfolios' chatbot successfuly! Come again after your next match to submit your scores",
    );
  } else {
    sendMessageHelper(
      messengerId,
      'There was an error while linking your account, please try again later',
    );
  }
};

module.exports = {
  sendMessage,
  linkMessengerAccountAllIncluded,
};
