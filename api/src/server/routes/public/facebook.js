import Router from 'koa-router';
import _ from 'lodash';
const router = new Router();
const BASE_URL = '/api/fb';
import { Chatbot } from '../../utils/ChatBot/index.js';
import * as service from '../../service/facebook.js';
import { FACEBOOK_VERIFY_TOKEN } from '../../../../../conf.js';
import { STATUS_ENUM } from '../../../../../common/enums/index.js';

router.post(`${BASE_URL}/messengerHook`, async ctx => {
  let body = ctx.request.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(async function (entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      let webhookEvent = entry.messaging[0];
      // eslint-disable-next-line no-console
      console.log(webhookEvent);
      const senderId = webhookEvent.sender.id;
      if (
        webhookEvent.message &&
        webhookEvent.message.text &&
        webhookEvent.message.text
          .trim()
          .toLowerCase()
          .includes('hardreset')
      ) {
        service.deleteChatbotInfos(senderId);
      } else {
        let {
          state: initialState,
          chatbotInfos: initialChatbotInfos,
        } = await service.getChatbotInfos(senderId);
        const chatbot = new Chatbot(senderId, initialState, {
          ...initialChatbotInfos,
        });
        await chatbot.handleEvent(webhookEvent);
        const endChatbotInfos = chatbot.chatbotInfos;
        const endState = chatbot.stateType;
        if (
          initialState !== endState ||
          !_.isEqual(initialChatbotInfos, endChatbotInfos)
        ) {
          chatbot.saveState();
        }
      }
    });
    // Returns a '200 OK' response to all requests
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'EVENT_RECEIVED',
    };
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    ctx.status = STATUS_ENUM.ERROR;
  }
});

router.get(`${BASE_URL}/messengerHook`, async ctx => {
  // Your verify token. Should be a random string.

  // Parse the query params
  let mode = ctx.request.query['hub.mode'];
  let token = ctx.request.query['hub.verify_token'];
  let challenge = ctx.request.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === FACEBOOK_VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      ctx.status = STATUS_ENUM.SUCCESS;
      ctx.message = challenge;
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      ctx.status = STATUS_ENUM.FORBIDDEN;
    }
  }
});

export default router;
