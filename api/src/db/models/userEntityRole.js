import { Model } from 'objection';
import { entitiesRole } from './entitiesRole.js';
import { userEmail } from './userEmail.js';
import { rosterPlayers } from './rosterPlayers.js';

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
          to: 'user_email.user_id'
        }
      },
      entitiesRole: {
        relation: Model.HasOneRelation,
        modelClass: entitiesRole,
        join: {
          from: 'user_entity_role.entity_id',
          to: 'entities_role.entity_id_admin'
        }
      },
      rosterPlayers: {
        relation: Model.HasOneRelation,
        modelClass: rosterPlayers,
        join: {
          from: 'user_entity_role.entity_id',
          to: 'roster_players.person_id'
        }
      },
    };
  }
}