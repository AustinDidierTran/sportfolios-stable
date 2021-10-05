import { Model } from 'objection';
import { userEntityRole } from './userEntityRole.js';
import { entities } from './entities.js';

export class entitiesRole extends Model {
  static get tableName() {
    return 'entities_role';
  }

  static get relationMappings() {
    return {
      entities: {
        relation: Model.HasManyRelation,
        modelClass: entities,
        join: {
          from: 'entities_role.entity_id',
          to: 'entities.id'
        }
      },
      userEntityRole: {
        relation: Model.HasOneRelation,
        modelClass: userEntityRole,
        join: {
          from: 'entities_role.entity_id_admin',
          to: 'user_entity_role.entity_id'
        }
      },
    };
  }
}