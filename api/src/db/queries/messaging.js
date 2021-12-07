import knex from '../connection.js';
import { conversationMessages } from '../models/conversationMessages.js';
import { conversationParticipants } from '../models/conversationParticipants.js';
import { conversations } from '../models/conversations.js';
const { raw } = require('objection');

export const getConversationById = async conversationId => {
  const [conversation] = await conversations
    .query()
    .withGraphJoined(
      '[conversationParticipants.entitiesGeneralInfos]',
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
    const convos = await conversationParticipants
      .query()
      .withGraphJoined(
        '[conversation.[conversationParticipants.entitiesGeneralInfos]]',
        { minimize: true },
      )
      .where('conversation_participants.participant_id', recipientId);

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

export const getConversationParticipantsByUserId = async (
  conversationId,
  userId,
) => {
  const participants = await conversationParticipants
    .query()
    .withGraphJoined('userEntityRole')
    .where(
      'conversation_participants.conversation_id',
      conversationId,
    )
    .andWhere('userEntityRole.user_id', userId)
    .debug();

  return participants;
};

export const getConversationWithParticipants = async participants => {
  const [{ conversation_id } = {}] = await conversationParticipants
    .query()
    .select('conversation_id')
    .groupBy('conversation_id')
    // eslint-disable-next-line
    .havingRaw(
      'sum(case when "participant_id" not in (' +
        participants.map(_ => '?').join(',') +
        ') then 1 else 0 end) = 0 and sum(case when "participant_id" in (' +
        participants.map(_ => '?').join(',') +
        ') then 1 else 0 end) = ?;',
      [...participants, ...participants, participants.length],
    );
  return conversation_id;
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

export const createMessage = async (
  conversationId,
  content,
  senderId,
) => {
  const message = await conversationMessages.query().insertGraph({
    text: content,
    conversation_id: conversationId,
    sender_id: senderId,
  });

  return message.id;
};

export const addParticipants = async (
  conversationId,
  participantIds,
) => {
  return await conversationParticipants
    .query()
    .insertGraph(
      participantIds.map(p => ({
        conversation_id: conversationId,
        participant_id: p,
      })),
    )
    .returning('conversation_id');
};

export const removeParticipant = async (
  conversationId,
  participantId,
) => {
  return await conversationParticipants
    .query()
    .delete()
    .where('conversation_id', conversationId)
    .andWhere('participant_id', participantId);
};

export const updateConversationName = async (
  conversationId,
  name,
) => {
  return await conversations
    .query()
    .patch({ name: name })
    .where('id', conversationId);
};

export const updateNickname = async (
  conversationId,
  participantId,
  nickname,
) => {
  return await conversationParticipants
    .query()
    .patch({ nickname: nickname })
    .where('conversation_id', conversationId)
    .andWhere('participant_id', participantId);
};

export const getLastMessageByConversationIds = async conversationIds => {
  const messages = await knex
    .select('*')
    .from(
      knex
        .select(
          knex.raw('MAX(created_at) AS maxDate'),
          'conversation_id AS cId',
        )
        .from('conversation_messages')
        .whereIn('conversation_id', conversationIds)
        .groupBy('conversation_messages.conversation_id')
        .as('lastMessage'),
    )
    .innerJoin(
      'conversation_messages',
      'cId',
      'conversation_messages.conversation_id',
    )
    .where(knex.raw('conversation_messages.created_at = maxDate'))
    .innerJoin(
      'entities_general_infos',
      'conversation_messages.sender_id',
      'entities_general_infos.entity_id',
    );

  return messages;
};
