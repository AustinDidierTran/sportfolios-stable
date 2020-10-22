const Router = require('koa-router');
const {
  MESSENGER_PAYLOADS,
  MESSENGER_MESSAGES_FR,
} = require('../../../../../common/enums');
const queries = require('../../../db/queries/facebook');
const router = new Router();
const BASE_URL = '/api/fb';

router.post(`${BASE_URL}/messengerHook`, async ctx => {
  let body = ctx.request.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      const senderId = webhook_event.sender.id;
      if (webhook_event.message) {
        //User sent a message
        if (webhook_event.message.quick_reply) {
          const payload = webhook_event.message.quick_reply.payload;
          if (payload == MESSENGER_PAYLOADS.IGNORE) {
            //do nothing
          }
        } else {
          queries.sendMessage(
            senderId,
            MESSENGER_MESSAGES_FR.I_DONT_UNDERSTAND,
          );
        }
      } else if (webhook_event.postback) {
        //Someone clicked on postbackbutton
        const payload = webhook_event.postback.payload;
        if (payload == MESSENGER_PAYLOADS.GET_STARTED) {
          //Clicked on get started button
          if (webhook_event.postback.referral) {
            //Came from the userSetting "connect" button, userID has been passed in ref
            const userId = webhook_event.postback.referral.ref;
            queries.linkMessengerAccountAllIncluded(userId, senderId);
          } else {
            //Did not click on userSetting "connect" button, so we can't know who clicked
            queries.sendMessage(
              senderId,
              MESSENGER_MESSAGES_FR.GET_STARTED_NO_REF,
            );
          }
        }
      } else if (webhook_event.referral) {
        //User clicked on connect from userSettings, but had already clicked on "get started" before
        const userId = webhook_event.referral.ref;
        queries.linkMessengerAccountAllIncluded(userId, senderId);
      }
    });

    // Returns a '200 OK' response to all requests
    ctx.status = 200;
    ctx.body = {
      status: 'EVENT_RECEIVED',
    };
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    ctx.status = 404;
  }
});

router.get(`${BASE_URL}/messengerHook`, async ctx => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = '7noYUm%z@vsOpi3pYUY6BPwre3!@7';

  // Parse the query params
  let mode = ctx.request.query['hub.mode'];
  let token = ctx.request.query['hub.verify_token'];
  let challenge = ctx.request.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      ctx.status = 200;
      ctx.message = challenge;
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      ctx.status = 403;
    }
  }
});

module.exports = router;
