import { Model } from 'objection';

export class stripeCustomer extends Model {
  static get tableName() {
    return 'stripe_customer';
  }
  static get idColumn() {
    return 'customer_id';
  }
}
