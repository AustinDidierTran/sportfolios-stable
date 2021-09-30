import { Model } from 'objection';
import { entities } from './entities.js';
import { personInfos } from './personInfos.js';

export class entitiesGeneralInfos extends Model {
  static get tableName() {
    return 'entities_general_infos';
  }

  static get idColumn() {
    return 'entity_id';
  }
  static get relationMappings() {
    return {
      entities: {
        relation: Model.HasOneRelation,
        modelClass: entities,
        join: {
          from: 'entities_general_infos.entity_id',
          to: 'entities.id'
        }
      },
      personInfos: {
        relation: Model.HasOneRelation,
        modelClass: personInfos,
        join: {
          from: 'entities_general_infos.infos_supp_id',
          to: 'personInfos.id'
        }
      },
    };
  }
}
