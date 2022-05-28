import { Model } from 'objection';
import { entitiesGeneralInfos } from './entitiesGeneralInfos.js';
import { entitiesRole } from './entitiesRole.js';
import { userEmail } from './userEmail.js';
import { rosterPlayers } from './rosterPlayers.js';
import { users } from './users.js';

export class userEntityRole extends Model {
  static get tableName() {
    return 'user_entity_role';
  }

  static get relationMappings() {
    return {
      userEmail: {
        relation: Model.HasManyRelation,
        modelClass: userEmail,
        join: {
          from: 'user_entity_role.user_id',
          to: 'user_email.user_id',
        },
      },
      entitiesGeneralInfos: {
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'user_entity_role.entity_id',
          to: 'entities_general_infos.entity_id',
        },
      },
      entitiesRole: {
        relation: Model.HasOneRelation,
        modelClass: entitiesRole,
        join: {
          from: 'user_entity_role.entity_id',
          to: 'entities_role.entity_id_admin',
        },
      },
      rosterPlayers: {
        relation: Model.HasOneRelation,
        modelClass: rosterPlayers,
        join: {
          from: 'user_entity_role.entity_id',
          to: 'roster_players.person_id',
        },
      },
      conversation_participants: {
        relation: Model.HasManyRelation,
        modelClass: userEntityRole,
        join: {
          from: 'user_entity_role.entity_id',
          to: 'conversation_participants.participant_id',
        },
      },
      user: {
        relation: Model.HasOneRelation,
        modelClass: users,
        join: {
          from: 'user_entity_role.user_id',
          to: 'users.id',
        },
      },
    };
  }
}
