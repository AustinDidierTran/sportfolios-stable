import { Model } from 'objection';
import { storeItemsAllInfos } from './storeItemsAllInfos.js';

export class stripePrice extends Model {
  static get tableName() {
    return 'stripe_price';
  }
  static get idColumn() {
    return 'stripe_price_id';
  }
  static get relationMappings() {
    return {
      storeItemsAllInfos: {
        relation: Model.HasManyRelation,
        modelClass: storeItemsAllInfos,
        join: {
          from: 'stripe_price.stripe_price_id',
          to: 'store_items_all_infos.stripe_price_id'
        }
      }
    };
  }
}