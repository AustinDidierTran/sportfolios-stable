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
router.get(`${BASE_URL}/allOwned`, async ctx => {
  const entity = await service.getAllOwnedPersonsOrganizations(
    ctx.body.userInfo.id,
    ctx.query.onlyAdmin,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
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

/** PUT */

router.put(`${BASE_URL}/addParticipants`, async ctx => {
  const userId = getUserId(ctx);
  const messages = await service.addParticipants(
    ctx.request.body.conversationId,
    ctx.request.body.participantIds,
    userId,
  );

  ctx.body = { data: messages };
});

router.put(`${BASE_URL}/removeParticipant`, async ctx => {
  const userId = getUserId(ctx);
  const messages = await service.removeParticipant(
    ctx.request.body.conversationId,
    ctx.request.body.participantId,
    userId,
  );

  ctx.body = { data: messages };
});

router.put(`${BASE_URL}/conversationName`, async ctx => {
  const userId = getUserId(ctx);
  const messages = await service.updateConversationName(
    ctx.request.body.conversationId,
    ctx.request.body.name,
    userId,
  );

  ctx.body = { data: messages };
});

router.put(`${BASE_URL}/nickname`, async ctx => {
  const userId = getUserId(ctx);
  const messages = await service.updateNickname(
    ctx.request.body.conversationId,
    ctx.request.body.participantId,
    ctx.request.body.nickname,
    userId,
  );

  ctx.body = { data: messages };
});

router.post(`${BASE_URL}/seeMessages`, async ctx => {
  const userId = getUserId(ctx);
  await service.seeMessages(ctx.request.body.entityId, userId);
});

router.post(`${BASE_URL}/seeConversation`, async ctx => {
  const userId = getUserId(ctx);
  await service.seeConversation(
    ctx.request.body.entityId,
    ctx.request.body.conversationId,
    userId,
  );
});

export default router;
