import knex from '../connection.js';
import { conversationMessages } from '../models/conversationMessages.js';
import { conversationParticipants } from '../models/conversationParticipants.js';
import { conversations } from '../models/conversations.js';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums/index.js';

export const getConversationById = async conversationId => {
  const [conversation] = await conversations
    .query()
    .withGraphJoined('[conversationParticipants.entitiesGeneralInfos]', {
      minimize: true,
    })
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
    .where('conversation_participants.conversation_id', conversationId);

  return participants;
};

export const getConversationParticipantsByUserId = async (
  conversationId,
  userId,
) => {
  const participants = await conversationParticipants
    .query()
    .withGraphJoined('userEntityRole')
    .where('conversation_participants.conversation_id', conversationId)
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
        participants.map(() => '?').join(',') +
        ') then 1 else 0 end) = 0 and sum(case when "participant_id" in (' +
        participants.map(() => '?').join(',') +
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

    await conversationParticipants.query(trx).insertGraph(participantsObj);

    return conversationId;
  });
};

export const createMessage = async (conversationId, content, senderId) => {
  const message = await conversationMessages.query().insertGraph({
    text: content,
    conversation_id: conversationId,
    sender_id: senderId,
  });

  return message.id;
};

export const addParticipants = async (conversationId, participantIds) => {
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

export const removeParticipant = async (conversationId, participantId) => {
  return await conversationParticipants
    .query()
    .delete()
    .where('conversation_id', conversationId)
    .andWhere('participant_id', participantId);
};

export const updateConversationName = async (conversationId, name) => {
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

export const getAllOwnedEntitiesMessaging = async (
  userId,
  onlyAdmin = false,
) => {
  // getPersons
  let entityIds = (
    await knex('user_entity_role')
      .select('entity_id')
      .where({
        user_id: userId,
      })
      .andWhere(
        'role',
        '<=',
        onlyAdmin ? ENTITIES_ROLE_ENUM.ADMIN : ENTITIES_ROLE_ENUM.EDITOR,
      )
  ).map(person => ({
    entity_id: person.entity_id,
    role: ENTITIES_ROLE_ENUM.ADMIN,
  }));

  let count = 0;
  let newEntityIds = [];

  // get all entities owned by persons and sub persons
  do {
    entityIds = [...newEntityIds, ...entityIds];
    entityIds = entityIds.filter(
      (entity, index) =>
        entityIds.findIndex(e => e.entity_id === entity.entity_id) === index,
    );

    newEntityIds = (
      await knex('entities_role')
        .select('entity_id', 'entity_id_admin', 'role')
        .whereIn(
          'entity_id_admin',
          entityIds.map(e => e.entity_id),
        )
        .andWhere(
          'role',
          '<=',
          onlyAdmin ? ENTITIES_ROLE_ENUM.ADMIN : ENTITIES_ROLE_ENUM.EDITOR,
        )
    ).map(entity => ({
      ...entity,
      role: Math.max(
        entity.role,
        entityIds.find(e => e.entity_id === entity.entity_id_admin).role,
      ),
    }));

    count++;
  } while (
    newEntityIds.some(id => !entityIds.find(e => e.entity_id === id)) &&
    count < 5
  );

  const entities = await knex
    .select('*')
    .from(
      knex
        .select(
          'entity_id',
          'type',
          'name',
          'surname',
          'photo_url',
          'unread_messages_amount',
        )
        .from('entities_general_infos')
        .leftJoin(
          'entities',
          'entities_general_infos.entity_id',
          '=',
          'entities.id',
        )
        .whereNull('deleted_at')
        .whereIn(
          'entities_general_infos.entity_id',
          entityIds.map(e => e.entity_id),
        )
        .groupBy(
          'entities_general_infos.entity_id',
          'entities.type',
          'entities_general_infos.name',
          'entities_general_infos.surname',
          'entities_general_infos.photo_url',
          'entities_general_infos.unread_messages_amount',
        )
        .as('res'),
    )
    .where('type', '<=', '2');

  return entities.map(entity => ({
    ...entity,
    photo_url: undefined,
    photoUrl: entity.photo_url,
    entity_id_admin: undefined,
    unread_messages_amount: undefined,
    unreadMessagesAmount: entity.unread_messages_amount,
    entity_id: undefined,
    id: entity.entity_id,
  }));
};

export const incrementUnreadMessageCount = async participantIds => {
  return knex('entities_general_infos')
    .update(
      'unread_messages_amount',
      knex.raw('unread_messages_amount::int + 1'),
    )
    .whereIn('entity_id', participantIds);
};

export const resetUnreadMessages = async entityId => {
  return knex('entities_general_infos')
    .update('unread_messages_amount', 0)
    .where('entity_id', entityId);
};

export const updateReadReceipt = async (entityId, conversationId) => {
  return knex('conversation_participants')
    .update('read_last_message_at', 'now()')
    .where('conversation_id', conversationId)
    .andWhere('participant_id', entityId);
};

export const resetReadReceipts = async (participantIds, conversationId) => {
  return knex('conversation_participants')
    .update('read_last_message_at', null)
    .whereIn('participant_id', participantIds)
    .andWhere('conversation_id', conversationId);
};
