import { Model } from 'objection';
import { eventRosters } from './eventRosters.js';

export class eventPaymentOptions extends Model {
  static get tableName() {
    return 'event_payment_options';
  }

  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.

    return {
      eventRosters: {
        relation: Model.HasManyRelation,
        modelClass: eventRosters,
        join: {
          from: 'event_payment_options.id',
          to: 'event_rosters.payment_option_id'
        }
      },
    };
  }
}
