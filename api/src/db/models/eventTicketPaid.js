import { Model } from 'objection';
import { eventTicketOptions } from './eventTicketOptions.js';
import { stripeInvoiceItem } from './stripeInvoiceItem.js';

export class eventTicketPaid extends Model {
  static get tableName() {
    return 'event_ticket_paid';
  }

  static get relationMappings() {
    return {
      eventTicketOptions: {
        relation: Model.HasOneRelation,
        modelClass: eventTicketOptions,
        join: {
          from: 'event_ticket_paid.event_ticket_options_id',
          to: 'event_ticket_options.id'
        }
      },
      stripeInvoiceItem: {
        relation: Model.HasOneRelation,
        modelClass: stripeInvoiceItem,
        join: {
          from: 'event_ticket_paid.invoice_item_id',
          to: 'stripe_invoice_item.invoice_item_id'
        }
      }
    };
  }
}