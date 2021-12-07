import {
  ENTITIES_ROLE_ENUM,
  SOCKET_EVENT,
} from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { isAllowed } from './entity-deprecate.js';
import * as queries from '../../db/queries/messaging.js';
import * as userQueries from '../../db/queries/user.js';
import * as socket from '../websocket/socket.io.js';

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
  const conversationsParticipants = await queries.getConversations({
    recipientId,
    page,
    searchQuery,
  });
  const lastMessages = await queries.getLastMessageByConversationIds(conversationsParticipants.map(c => c.conversation_id));

  // Return these conversations
  return conversationsParticipants.map((convo) => {
    const convoLastMessage = lastMessages.find(m => m.conversation_id === convo.conversation_id)
    return {
      id: convo.conversation.id,
      lastMessage: convoLastMessage && {
        id: convoLastMessage.id,
        conversationId: convoLastMessage.conversation_id,
        sender: {
          id: convoLastMessage.entity_id,
          name: convoLastMessage.name,
          surname: convoLastMessage.surname,
          nickname: convoLastMessage.nickname,
          photoUrl: convoLastMessage.photo_url,
        },
        sentAt: convoLastMessage.maxdate,
        content: convoLastMessage.text,
      },
      name: convo.conversation.name,
      participants: convo.conversation.conversationParticipants.map(
        cp => ({
          id: cp.participant_id,
          name: cp.entitiesGeneralInfos.name,
          surname: cp.entitiesGeneralInfos.surname,
          nickname: cp.entitiesGeneralInfos.nickname,
          photoUrl: cp.entitiesGeneralInfos.photo_url,
        }),
      ),
    }
  });
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
  const [lastMessage] = await queries.getLastMessageByConversationIds([conversationId]);

  // Return these conversations
  return {
    conversation: {
      id: conversation.id,
      lastMessage: lastMessage && {
        id: lastMessage.id,
        conversationId: lastMessage.conversation_id,
        sender: {
          id: lastMessage.entity_id,
          name: lastMessage.name,
          surname:
            lastMessage.surname,
          nickname:
            lastMessage.nickname,
          photoUrl:
            lastMessage.photo_url,
        },
        sentAt: lastMessage.maxdate,
        content: lastMessage.text,
      },
      name: conversation.name,
      participants: conversation.conversationParticipants.map(cp => ({
        id: cp.participant_id,
        name: cp.entitiesGeneralInfos.name,
        surname: cp.entitiesGeneralInfos.surname,
        nickname: cp.nickname,
        photoUrl: cp.entitiesGeneralInfos.photo_url,
      })),
    },
    messages: messages.map(message => ({
      id: message.id,
      conversationId: message.conversation_id,
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
  const messageId = await queries.createMessage(
    conversationId,
    content.trim(),
    senderId,
  );

  // Send the websocket to all participants

  // 1. Find all the participants
  const participants = await queries.getConversationParticipants(
    conversationId,
  );

  // 2. Find all the users from these participants
  const participantIds = participants.map(p => p.participant_id);

  const users = await userQueries.getUserIdFromEntityId(
    participantIds,
  );

  const userIds = users
    .map(user => user.user_id)
    .filter((value, index, array) => array.indexOf(value) === index);

  // 3. Get the message information
  const message = await queries.getMessageById(messageId);

  // 4. Send the new message to these users
  userIds.forEach(userId => {
    socket.emit(SOCKET_EVENT.MESSAGES, userId, {
      id: message.id,
      conversationId: message.conversation_id,
      sentAt: message.created_at,
      content: message.text,
      sender: {
        id: message.entitiesGeneralInfos.entity_id,
        name: message.entitiesGeneralInfos.name,
        surname: message.entitiesGeneralInfos.surname,
        photoUrl: message.entitiesGeneralInfos.photo_url,
      },
    });
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

const isUserInConversation = async (conversationId, userId) => {
  const participants = await queries.getConversationParticipantsByUserId(
    conversationId,
    userId,
  );
  return participants.length > 0;
};

export const addParticipants = async (
  conversationId,
  participantIds,
  userId,
) => {
  if (!(await isUserInConversation(conversationId, userId))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return queries.addParticipants(conversationId, participantIds);
};

export const removeParticipant = async (
  conversationId,
  participantId,
  userId,
) => {
  if (!(await isUserInConversation(conversationId, userId))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return queries.removeParticipant(conversationId, participantId);
};

export const updateConversationName = async (
  conversationId,
  name,
  userId,
) => {
  if (!(await isUserInConversation(conversationId, userId))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return queries.updateConversationName(conversationId, name);
};

export const updateNickname = async (
  conversationId,
  participantId,
  nickname,
  userId,
) => {
  if (!(await isUserInConversation(conversationId, userId))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return queries.updateNickname(
    conversationId,
    participantId,
    nickname,
  );
};
