import knex from '../connection.js';
import { conversationMessages } from '../models/conversationMessages.js';
import { conversationParticipants } from '../models/conversationParticipants.js';
import { conversations } from '../models/conversations.js';

export const getConversationById = async conversationId => {
  const [conversation] = await conversations
    .query()
    .withGraphJoined(
      '[conversationParticipants.entitiesGeneralInfos, lastMessage.entitiesGeneralInfos]',
    )
    .modifyGraph('conversationMessages', builder =>
      builder.orderBy('created_at', 'desc'),
    )
    .where('conversations.id', conversationId);

  return conversation;
};

export const getConversations = async ({
  recipientId,
  // page
}) =>
  // searchQuery,
  {
    // Search is not supported for now :)
    // Implement search + filter
    const convos = await conversations
      .query()
      .withGraphJoined(
        '[conversationParticipants.conversations.conversationParticipants.entitiesGeneralInfos, lastMessage.entitiesGeneralInfos]',
        { minimize: true },
      )
      .modifyGraph('conversationMessages', builder =>
        builder.orderBy('created_at', 'desc'),
      )
      .where('_t0.participant_id', recipientId);

    return convos;
  };

export const getConversationParticipants = async conversationId => {
  const participants = await conversationParticipants
    .query()
    .where(
      'conversation_participants.conversation_id',
      conversationId,
    );

  return participants;
};

export const getConversationWithParticipants = async participants => {
  // [SPO-151]
  const cParticipants = await conversationParticipants.query();

  // Make a list of all conversations inside conversationParticipants
  const participantsMap = Object.entries(
    cParticipants.reduce(
      (conversations, cp) => ({
        ...conversations,
        [cp.conversation_id]: conversations[cp.conversation_id]
          ? [...conversations[cp.conversation_id], cp.participant_id]
          : [cp.participant_id],
      }),
      {},
    ),
  );

  // From all these conversations, find a conversation that has all of them, but no more than them
  const [conversationId] =
    participantsMap.find(([, ps]) => {
      if (ps.length !== participants.length) {
        return false;
      }

      return ps.every(
        p1 => participants.findIndex(p2 => p1 === p2) !== -1,
      );
    }) || [];

  return conversationId;
};

export const getMessagesFromConversation = async conversationId => {
  return conversationMessages
    .query()
    .withGraphJoined('entitiesGeneralInfos')
    .where('conversation_messages.conversation_id', conversationId);
};

export const getMessageById = async id => {
  const [message] = await conversationMessages
    .query()
    .withGraphJoined('entitiesGeneralInfos')
    .where('conversation_messages.id', id);

  return message;
};

export const createConversation = async participants => {
  // Create conversation
  return knex.transaction(async trx => {
    const { id: conversationId } = await conversations
      .query(trx)
      .insertGraph({})
      .returning('id');

    const participantsObj = participants.map(p => ({
      conversation_id: conversationId,
      participant_id: p,
    }));

    await conversationParticipants
      .query(trx)
      .insertGraph(participantsObj);

    return conversationId;
  });
};

export const createMessage = async ({
  conversationId,
  content,
  senderId,
}) => {
  const message = await conversationMessages.query().insertGraph({
    text: content,
    conversation_id: conversationId,
    sender_id: senderId,
  });

  return message.id;
};
