import { Model } from 'objection';
import { conversationMessages } from './conversationMessages.js';
import { conversationParticipants } from './conversationParticipants.js';

export class conversations extends Model {
  static get tableName() {
    return 'conversations';
  }

  static get relationMappings() {
    return {
      conversationMessages: {
        relation: Model.HasManyRelation,
        modelClass: conversationMessages,
        join: {
          from: 'conversations.id',
          to: 'conversation_messages.conversation_id',
        },
      },
      lastMessage: {
        relation: Model.HasOneRelation,
        modelClass: conversationMessages,
        join: {
          from: 'conversations.id',
          to: 'conversation_messages.conversation_id',
        },
      },
      conversationParticipants: {
        relation: Model.HasManyRelation,
        modelClass: conversationParticipants,
        join: {
          from: 'conversations.id',
          to: 'conversation_participants.conversation_id',
        },
      },
    };
  }
}
