import { Model } from 'objection';
import { entities } from './entities';

export class storeItemsPaid extends Model {
  static get tableName() {
    return 'store_items_paid';
  }

  static get relationMappings() {
    return {
      sellerEntityId: {
        relation: Model.HasOneRelation,
        modelClass: entities,
        join: {
          from: 'store_items_paid.seller_entity_id',
          to: 'entities.id',
        },
      },
    };
  }
}
