import Router from 'koa-router';
import { getUserId } from '../../helper/userHelper.js';
import * as service from '../../service/messaging.js';

const router = new Router();
const BASE_URL = '/api/messaging';

/** GET */
router.get(BASE_URL, async ctx => {
  const userId = getUserId(ctx);
  const conversations = await service.getConversations(
    {
      page: ctx.query.page,
      recipientId: ctx.query.recipientId,
      searchQuery: ctx.query.searchQuery,
    },
    userId,
  );

  ctx.body = { data: conversations };
});

router.get(`${BASE_URL}/messages`, async ctx => {
  const userId = getUserId(ctx);
  const conversations = await service.getConversationMessages(
    {
      conversationId: ctx.query.conversationId,
      page: ctx.query.page,
    },
    userId,
  );

  ctx.body = { data: conversations };
});

/** POST */
router.post(`${BASE_URL}/message`, async ctx => {
  const userId = getUserId(ctx);
  const messages = await service.sendMessage(
    {
      conversationId: ctx.request.body.conversationId,
      content: ctx.request.body.content,
      senderId: ctx.request.body.senderId,
    },
    userId,
  );

  ctx.body = { data: messages };
});

router.post(`${BASE_URL}/conversation`, async ctx => {
  const userId = getUserId(ctx);
  const conversationId = await service.createConversation(
    {
      participantIds: ctx.request.body.participantIds,
      creatorId: ctx.request.body.creatorId,
    },
    userId,
  );

  ctx.body = { data: conversationId };
});

export default router;

/** PUT */
