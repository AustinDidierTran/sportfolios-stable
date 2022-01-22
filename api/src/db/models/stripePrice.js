import { Model } from 'objection';
import { storeItemsAllInfos } from './storeItemsAllInfos.js';
import { stripeInvoiceItem } from './stripeInvoiceItem.js';
import { eventTicketOptions } from './eventTicketOptions.js';
import { storeItems } from './storeItems.js';
import { stripeProduct } from './stripeProduct.js';
import { taxRatesStripePrice } from './taxRatesStripePrice.js';
import { taxRates } from './taxRates.js';
import { entitiesGeneralInfos } from './entitiesGeneralInfos.js';

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
      storeItems: {
        relation: Model.HasOneRelation,
        modelClass: storeItems,
        join: {
          from: 'stripe_price.stripe_price_id',
          to: 'store_items.stripe_price_id'
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
      stripeProduct: {
        relation: Model.HasOneRelation,
        modelClass: stripeProduct,
        join: {
          from: 'stripe_price.stripe_product_id',
          to: 'stripe_product.stripe_product_id'
        }
      },
      taxRates: {
        relation: Model.ManyToManyRelation,
        modelClass: taxRates,
        join: {
          from: 'stripe_price.stripe_price_id',         
        through: {
          from: 'tax_rates_stripe_price.stripe_price_id',
          to: 'tax_rates_stripe_price.tax_rate_id'
        },
          to: 'tax_rates.id'
        }
      },
      owner:{
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'stripe_price.owner_id',
          to: 'entities_general_infos.entity_id'
        }
      },
    };
  }
}