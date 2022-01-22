import { Model } from 'objection';

export class stripeProduct extends Model {
  static get tableName() {
    return 'stripe_product';
  }  
  static get idColumn() {
    return 'stripe_product_id';
  }
}