import { Model } from 'objection';
import { stripePrice } from './stripePrice.js';
import { eventTicketPaid } from './eventTicketPaid.js';
import { userEmail } from './userEmail.js';
import { userPrimaryPerson } from './userPrimaryPerson.js';

export class stripeInvoiceItem extends Model {
  static get tableName() {
    return 'stripe_invoice_item';
  }

  static get idColumn() {
    return 'invoice_item_id';
  }

  static get relationMappings() {
    return {
      stripePrice: {
        relation: Model.HasOneRelation,
        modelClass: stripePrice,
        join: {
          from: 'stripe_invoice_item.stripe_price_id',
          to: 'stripe_price.stripe_price_id'
        }
      },
      eventTicketPaid: {
        relation: Model.HasManyRelation,
        modelClass: eventTicketPaid,
        join: {
          from: 'stripe_invoice_item.invoice_item_id',
          to: 'event_ticket_paid.invoice_item_id'
        }
      },
      userEmail: {
        relation: Model.HasOneRelation,
        modelClass: userEmail,
        join: {
          from: 'stripe_invoice_item.user_id',
          to: 'user_email.user_id'
        }
      },
      userPrimaryPerson: {
        relation: Model.HasOneRelation,
        modelClass: userPrimaryPerson,
        join: {
          from: 'stripe_invoice_item.user_id',
          to: 'user_primary_person.user_id'
        }
      }
    };
  }
}