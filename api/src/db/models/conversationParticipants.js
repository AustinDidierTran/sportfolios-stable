import { Model } from 'objection';
import { conversationMessages } from './conversationMessages.js';
import { conversations } from './conversations.js';
import { entitiesGeneralInfos } from './entitiesGeneralInfos.js';
import { userEntityRole } from './userEntityRole.js';

export class conversationParticipants extends Model {
  static get tableName() {
    return 'conversation_participants';
  }

  static get idColumn() {
    return ['conversation_id', 'participant_id'];
  }

  static get relationMappings() {
    return {
      conversations: {
        relation: Model.HasOneRelation,
        modelClass: conversations,
        join: {
          from: 'conversation_participants.conversation_id',
          to: 'conversations.id',
        },
      },
      conversationMessages: {
        relation: Model.HasOneRelation,
        modelClass: conversationMessages,
        join: {
          from: 'conversation_participants.last_seen_message',
          to: 'conversation_messages.id',
        },
      },
      entitiesGeneralInfos: {
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'conversation_participants.participant_id',
          to: 'entities_general_infos.entity_id',
        },
      },
      userEntityRole: {
        relation: Model.HasOneRelation,
        modelClass: userEntityRole,
        join: {
          from: 'conversation_participants.participant_id',
          to: 'userEntityRole.entity_id',
        },
      }
    };
  }
}
