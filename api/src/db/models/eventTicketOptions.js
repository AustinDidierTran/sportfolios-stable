import { Model } from 'objection';
import { games } from './games.js';
import { eventTicketPaid } from './eventTicketPaid.js';
import { stripePrice } from './stripePrice.js';

export class eventTicketOptions extends Model {
  static get tableName() {
    return 'event_ticket_options';
  }

  static get relationMappings() {
    return {
      games: {
        relation: Model.HasOneRelation,
        modelClass: games,
        join: {
          from: 'event_ticket_options.game_id',
          to: 'games.id'
        }
      },
      eventTicketPaid: {
        relation: Model.HasManyRelation,
        modelClass: eventTicketPaid,
        join: {
          from: 'event_ticket_options.id',
          to: 'event_ticket_paid.event_ticket_options_id'
        }
      },
      stripePrice: {
        relation: Model.HasOneRelation,
        modelClass: stripePrice,
        join: {
          from: 'event_ticket_options.stripe_price_id',
          to: 'stripe_price.stripe_price_id'
        }
      },
    };
  }
}