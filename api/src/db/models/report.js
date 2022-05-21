import { Model } from 'objection';
import { entities } from './entities';

export class reports extends Model {
  static get tableName() {
    return 'reports';
  }
  static get idColumn() {
    return 'report_id';
  }
  static get relationMappings() {
    return {
      entities: {
        relation: Model.HasOneRelation,
        modelClass: entities,
        join: {
          from: 'reports.entity_id',
          to: 'entities.id',
        },
      },
    };
  }
}
