import { Model } from 'objection';

export class storeItems extends Model {
  static get tableName() {
    return 'store_items';
  }
  static get idColumn() {
    return 'stripe_price_id';
  }
}