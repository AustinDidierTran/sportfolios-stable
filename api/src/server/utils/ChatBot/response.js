const {
  MESSENGER_MESSAGES_FR,
} = require('../../../../../common/enums');
const queries = require('../../../db/queries/facebook');

async function getStartedResponse(messengerId, userId) {
  let response;

  if (userId) {
    const res = await queries.linkMessengerAccount(
      userId,
      messengerId,
    );
    if (res) {
      response = genText(MESSENGER_MESSAGES_FR.CONNECTION_SUCCESS);
    } else {
      response = genText(MESSENGER_MESSAGES_FR.CONNECTION_ERROR);
    }
  } else {
    response = genText(MESSENGER_MESSAGES_FR.GET_STARTED_NO_REF);
  }
  return response;
}

function genText(text) {
  let response = {
    text,
  };

  return response;
}

module.exports = {
  getStartedResponse,
};
