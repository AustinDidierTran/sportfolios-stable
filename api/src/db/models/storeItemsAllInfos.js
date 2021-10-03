import { Model } from 'objection';
import { stripePrice } from './stripePrice.js';

export class storeItemsAllInfos extends Model {
  static get tableName() {
    return 'store_items_all_infos';
  }
  static get idColumn() {
    return 'entity_id';
  }
  static get relationMappings() {
    return {
      stripePrice: {
        relation: Model.HasOneRelation,
        modelClass: stripePrice,
        join: {
          from: 'store_items_all_infos.stripe_price_id',
          to: 'stripe_price.stripe_price_id'
        }
      }
    };
  }
}