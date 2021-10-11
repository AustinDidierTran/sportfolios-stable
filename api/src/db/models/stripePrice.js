import { Model } from 'objection';
import { storeItemsAllInfos } from './storeItemsAllInfos.js';
import { stripeInvoiceItem } from './stripeInvoiceItem.js';
import { eventTicketOptions } from './eventTicketOptions.js';

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
      },
      stripeInvoiceItem: {
        relation: Model.HasManyRelation,
        modelClass: stripeInvoiceItem,
        join: {
          from: 'stripe_price.stripe_price_id',
          to: 'stripe_invoice_item.stripe_price_id'
        }
      },
      eventTicketOptions: {
        relation: Model.HasManyRelation,
        modelClass: eventTicketOptions,
        join: {
          from: 'stripe_price.stripe_price_id',
          to: 'event_ticket_options.stripe_price_id'
        }
      },
    };
  }
}