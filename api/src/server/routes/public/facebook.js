const Router = require('koa-router');
const router = new Router();
const BASE_URL = '/api/fb';
const { handleMessage } = require('../../utils/ChatBot/receive');

router.post(`${BASE_URL}/messengerHook`, async ctx => {
  let body = ctx.request.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      let webhookEvent = entry.messaging[0];
      // eslint-disable-next-line no-console
      console.log(webhookEvent);
      const senderId = webhookEvent.sender.id;
      return handleMessage(senderId, webhookEvent);
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
