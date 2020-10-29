const { MESSENGER_PAYLOADS } = require('../../../../../common/enums');
const {
  unsuportedMessageResponse,
  getStartedResponse,
} = require('./response.js');
const {
  handleSpiritCommunication,
  handleSpiritEquity,
  handleSpiritRules,
  handleSpiritFoul,
  handleSpiritSelfControl,
  handleSpiritNoPayload,
  handleScoreSubmission,
  handleConfirmationNoPayload,
  handleSpiritConfirmation,
  handleScoreConfirmation,
} = require('./scoreSubmission.js');

const payloadHandler = {
  [MESSENGER_PAYLOADS.GET_STARTED]: handleGetStarted,
  [MESSENGER_PAYLOADS.SPIRIT_COMMUNICATION]: handleSpiritCommunication,
  [MESSENGER_PAYLOADS.SPIRIT_EQUITY]: handleSpiritEquity,
  [MESSENGER_PAYLOADS.SPIRIT_RULES]: handleSpiritRules,
  [MESSENGER_PAYLOADS.SPIRIT_FOUL]: handleSpiritFoul,
  [MESSENGER_PAYLOADS.SPIRIT_SELF_CONTROL]: handleSpiritSelfControl,
  [MESSENGER_PAYLOADS.SPIRIT_CONFIRMATION]: handleSpiritConfirmation,
  [MESSENGER_PAYLOADS.SCORE_CONFIRMATION]: handleScoreConfirmation,
};

async function handleMessage(messengerId, event) {
  let responses;

  try {
    if (event.message) {
      const message = event.message;

      if (message.quick_reply) {
        responses = await handleQuickReply(messengerId, event);
      } else if (message.attachments) {
        responses = await handleAttachmentMessage(messengerId, event);
      } else if (message.text) {
        responses = await handleTextMessage(messengerId, message);
      }
    } else if (event.postback) {
      responses = await handlePostback(messengerId, event);
    } else if (event.referral) {
      responses = await handleReferral(messengerId, event);
    } else {
      //not supported message type, just ignore
      return;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    responses = await getErrorResponse();
  }

  if (Array.isArray(responses)) {
    let delay = 0;
    for (let response of responses) {
      sendMessages(response, delay * 2000);
      delay++;
    }
  } else {
    sendMessages(responses);
  }
}

async function handleQuickReply(messengerId, event) {
  const payload = event.message.quick_reply.payload;
  return handlePayload(messengerId, event, payload);
}

async function handleTextMessage(messengerId, event) {
  const greeting = firstEntity(event.message.nlp, 'greetings');
  const isGreeting = greeting && greeting.confidence > 0.8;
  let response;
  const message = event.message.text.trim().toLowerCase();
  if (isGreeting || message.includes('recommencer')) {
    response = await getStartedResponse(messengerId);
  } else if (Number(message)) {
    response = await handleNumber(messengerId, message);
  } else if (message == 'oui') {
    response = await handleConfirmationNoPayload(messengerId, true);
  } else if (message == 'non') {
    response = await handleConfirmationNoPayload(messengerId, false);
  } else if (/[0-9]*-[0-9]*/i.test(message)) {
    const scores = message.split('-');
    response = await handleScoreSubmission(
      messengerId,
      scores[0],
      scores[1],
    );
  } else {
    response = unsuportedMessageResponse(messengerId, event);
  }
  return response;
}

async function handleNumber(messengerId, number) {
  handleSpiritNoPayload(messengerId, number);
}

function firstEntity(nlp, name) {
  return (
    nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0]
  );
}

function handleAttachmentMessage(messengerId, event) {
  return unsuportedMessageResponse(messengerId, event);
}

async function handlePostback(messengerId, event) {
  const payload = event.postback.payload;
  let response;
  if (payload === MESSENGER_PAYLOADS.GET_STARTED) {
    const userId = event.postback.referral.ref;
    response = getStartedResponse(messengerId, userId);
  } else {
    response = await handlePayload(messengerId, event, payload);
  }

  return response;
}

async function handleReferral(messengerId, event) {
  const userId = event.referral.ref;
  return getStartedResponse(messengerId, userId);
}

async function handlePayload(messengerId, event, payload) {
  const handler = payloadHandler[payload];
  let response;
  if (!handler) {
    // eslint-disable-next-line no-console
    console.error(
      `PayloadHandler for '${payload}' is not implemented yet`,
    );
    response = await unsuportedMessageResponse(messengerId, event);
  } else {
    response = await handler(messengerId, event);
  }
  return response;
}

module.exports = {
  handleMessage,
};
