import { ENTITIES_ROLE_ENUM } from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { isAllowed } from './entity-deprecate.js';
import * as queries from '../../db/queries/messaging.js';

export const getConversations = async (
  { page, recipientId, searchQuery },
  userId,
) => {
  // Validate the recipient is accessible from the user
  if (
    !(await isAllowed(recipientId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  // Find all the conversations id that have a person with search query
  const conversations = await queries.getConversations({
    recipientId,
    page,
    searchQuery,
  });

  // Return these conversations
  return conversations
    .map(convo => ({
      id: convo.id,
      lastMessage: convo.lastMessage && {
        id: convo.lastMessage.id,
        sender: {
          id: convo.lastMessage.entitiesGeneralInfos.entity_id,
          name: convo.lastMessage.entitiesGeneralInfos.name,
          surname: convo.lastMessage.entitiesGeneralInfos.surname,
          nickname: convo.lastMessage.entitiesGeneralInfos.nickname,
          photoUrl: convo.lastMessage.entitiesGeneralInfos.photo_url,
        },
        sentAt: convo.lastMessage.created_at,
        content: convo.lastMessage.text,
      },
      name: convo.name,
      participants: convo.conversationParticipants[0].conversations.conversationParticipants.map(cp => ({
        id: cp.participant_id,
        name: cp.entitiesGeneralInfos.name,
        surname: cp.entitiesGeneralInfos.surname,
        nickname: cp.entitiesGeneralInfos.nickname,
        photoUrl: cp.entitiesGeneralInfos.photo_url,
      })),
    }));
};

export const getConversationMessages = async (
  {
    conversationId,
    // page
  },
  userId,
) => {
  // Find all the people from the conversation
  const participants = await queries.getConversationParticipants(
    conversationId,
  );

  // Validate that the user has access to at least one user
  const userIsAllowed = await Promise.all(
    participants.map(async p =>
      isAllowed(p.participant_id, userId, ENTITIES_ROLE_ENUM.EDITOR),
    ),
  );

  if (!userIsAllowed.some(userIsAllowed => userIsAllowed)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  // Get messages based on paging
  const messages = await queries.getMessagesFromConversation(
    conversationId,
  );

  // Find all the conversations id that have a person with search query
  const conversation = await queries.getConversationById(
    conversationId,
  );

  // Return these conversations
  return {
    conversation: {
      id: conversation.id,
      lastMessage: conversation.lastMessage && {
        id: conversation.lastMessage.id,
        sender: {
          id: conversation.lastMessage.entitiesGeneralInfos.entity_id,
          name: conversation.lastMessage.entitiesGeneralInfos.name,
          surname:
            conversation.lastMessage.entitiesGeneralInfos.surname,
          nickname:
            conversation.lastMessage.entitiesGeneralInfos.nickname,
          photoUrl:
            conversation.lastMessage.entitiesGeneralInfos.photo_url,
        },
        sentAt: conversation.lastMessage.created_at,
        content: conversation.lastMessage.text,
      },
      name: conversation.name,
      participants: conversation.conversationParticipants.map(cp => ({
        id: cp.participant_id,
        name: cp.entitiesGeneralInfos.name,
        surname: cp.entitiesGeneralInfos.surname,
        nickname: cp.entitiesGeneralInfos.nickname,
        photoUrl: cp.entitiesGeneralInfos.photo_url,
      })),
    },
    messages: messages.map(message => ({
      id: message.id,
      sentAt: message.created_at,
      content: message.text,
      sender: {
        id: message.entitiesGeneralInfos.entity_id,
        name: message.entitiesGeneralInfos.name,
        surname: message.entitiesGeneralInfos.surname,
        photoUrl: message.entitiesGeneralInfos.photo_url,
      },
    })),
  };
};

export const sendMessage = async (
  { conversationId, content, senderId },
  userId,
) => {
  // Validate the senderId is accessible from the user
  if (
    !(await isAllowed(senderId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  // Create the message
  await queries.createMessage({
    conversationId,
    content,
    senderId,
  });
};

export const createConversation = async (
  { participantIds, creatorId },
  userId,
) => {
  // Validate that you have access to the user
  if (
    !(await isAllowed(creatorId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  const participants = [...participantIds, creatorId].filter(
    (value, index, a) => a.findIndex(v => v === value) === index,
  );

  // If the conversation exists, return the id
  let conversationId;

  conversationId = await queries.getConversationWithParticipants(
    participants,
  );

  if (conversationId) {
    return conversationId;
  }

  // Else, create the conversation
  conversationId = await queries.createConversation(
    participants,
    creatorId,
  );

  // Then, return the id
  return conversationId;
};
