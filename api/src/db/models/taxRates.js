import { Model } from 'objection';

export class taxRates extends Model {
  static get tableName() {
    return 'tax_rates';
  } 
}