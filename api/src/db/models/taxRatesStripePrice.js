import { Model } from 'objection';
import { taxRates } from './taxRates.js';

export class taxRatesStripePrice extends Model {
  static get tableName() {
    return 'tax_rates_stripe_price';
  } 
  static get idColumn() {
    return ['stripe_price_id', 'tax_rate_id'];
  }

  static get relationMappings() {
    return {
      taxRates: {
        relation: Model.HasOneRelation,
        modelClass: taxRates,
        join: {
          from: 'tax_rates_stripe_price.tax_rate_id',
          to: 'tax_rates.id'
        }
      },
    }
  }
}