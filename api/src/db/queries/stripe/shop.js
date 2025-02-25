import stripeLib from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);

import knex from '../../connection.js';
import {
  stripeErrorLogger,
  stripeLogger,
} from '../../../server/utils/logger.js';
import {
  PLATEFORM_FEES,
  PLATEFORM_FEES_FIX,
  CART_ITEM,
} from '../../../../../common/enums/index.js';

export const addProduct = async body => {
  const { stripeProduct } = body;
  try {
    const product = await stripe.products.create(stripeProduct);
    await knex('stripe_product').insert({
      stripe_product_id: product.id,
      label: product.name,
      description: product.description,
      active: product.active,
      metadata: product.metadata,
    });

    stripeLogger(`Product created, ${product.id}`);

    return product;
  } catch (err) {
    stripeErrorLogger('addProduct error', err);
    throw err;
  }
};

export const addPrice = async body => {
  const { stripePrice, entityId, photoUrl, ownerId, taxRatesId } = body;
  try {
    const price = await stripe.prices.create(stripePrice);
    let transactionFees = price.unit_amount;
    if (taxRatesId) {
      await Promise.all(
        taxRatesId.map(async taxRateId => {
          const [{ percentage }] = await knex('tax_rates')
            .select('percentage')
            .where({ id: taxRateId });
          transactionFees =
            transactionFees + price.unit_amount * (percentage / 100);
        }),
      );
    }

    transactionFees = Math.floor(
      transactionFees * PLATEFORM_FEES + PLATEFORM_FEES_FIX,
    );

    await knex('stripe_price').insert({
      stripe_price_id: price.id,
      stripe_product_id: price.product,
      amount: price.unit_amount,
      active: price.active,
      transaction_fees: transactionFees,
      start_date: new Date(price.created * 1000),
      metadata: price.metadata,
      owner_id: ownerId,
    });

    if (taxRatesId) {
      await Promise.all(
        taxRatesId.map(async taxRateId => {
          await knex('tax_rates_stripe_price').insert({
            stripe_price_id: price.id,
            tax_rate_id: taxRateId,
          });
        }),
      );
    }

    await knex('store_items').insert({
      entity_id: entityId,
      stripe_price_id: price.id,
      photo_url: photoUrl,
    });

    stripeLogger(`Price created, ${price.id}`);

    return price;
  } catch (err) {
    stripeErrorLogger('addPrice error', err);
    throw err;
  }
};

export const editPrice = async body => {
  const {
    stripePrice,
    entityId,
    photoUrl,
    stripePriceIdToUpdate,
    taxRatesId,
  } = body;
  try {
    const price = await stripe.prices.create(stripePrice);
    let transactionFees = price.unit_amount;
    if (taxRatesId) {
      await Promise.all(
        taxRatesId.map(async taxRateId => {
          const [{ percentage }] = await knex('tax_rates')
            .select('percentage')
            .where({ id: taxRateId });
          transactionFees =
            transactionFees + price.unit_amount * (percentage / 100);
        }),
      );
    }

    transactionFees = Math.floor(
      transactionFees * PLATEFORM_FEES + PLATEFORM_FEES_FIX,
    );

    await knex('stripe_price').insert({
      stripe_price_id: price.id,
      stripe_product_id: price.product,
      amount: price.unit_amount,
      active: price.active,
      transaction_fees: transactionFees,
      start_date: new Date(price.created * 1000),
      metadata: price.metadata,
      owner_id: entityId,
    });

    if (taxRatesId) {
      await Promise.all(
        taxRatesId.map(async taxRateId => {
          await knex('tax_rates_stripe_price').insert({
            stripe_price_id: price.id,
            tax_rate_id: taxRateId,
          });
        }),
      );
    }

    const res = await knex('store_items')
      .update({
        stripe_price_id: price.id,
        photo_url: photoUrl,
      })
      .where({
        stripe_price_id: stripePriceIdToUpdate,
        entity_id: entityId,
      });

    stripeLogger(`Price updated, ${price.id}`);

    return res;
  } catch (err) {
    stripeErrorLogger('editPrice error', err);
    throw err;
  }
};

export const createItem = async body => {
  const { stripeProduct, stripePrice, entityId, photoUrl, taxRatesId } = body;

  try {
    const product = await addProduct({
      stripeProduct,
    });

    const newStripePrice = {
      currency: stripePrice.currency,
      unit_amount: stripePrice.unit_amount,
      active: stripePrice.active,
      product: product.id,
      metadata: { type: CART_ITEM.SHOP_ITEM, id: entityId },
    };

    const price = await addPrice({
      stripePrice: { ...newStripePrice, product: product.id },
      entityId,
      photoUrl,
      ownerId: entityId,
      taxRatesId,
    });

    return price;
  } catch (err) {
    stripeErrorLogger('CreateItem error', err);
    throw err;
  }
};

export const editItem = async body => {
  const {
    stripeProduct,
    stripePrice,
    entityId,
    photoUrl,
    stripePriceIdToUpdate,
    taxRatesId,
  } = body;
  try {
    const product = await addProduct({
      stripeProduct,
    });

    const price = await editPrice({
      stripePrice: { ...stripePrice, product: product.id },
      entityId,
      photoUrl,
      stripePriceIdToUpdate,
      taxRatesId,
    });

    return price;
  } catch (err) {
    stripeErrorLogger('EditItem error', err);
    throw err;
  }
};

export const deleteProduct = async stripeProductId => {
  const numberDeleted = await knex('stripe_product')
    .where({ stripe_product_id: stripeProductId })
    .del();
  return numberDeleted;
};

export const deletePrice = async stripePriceId => {
  const numberDeleted = await knex('store_items')
    .where({ stripe_price_id: stripePriceId })
    .del();

  await knex('cart_items')
    .where({ stripe_price_id: stripePriceId })
    .del();

  await knex('tax_rates_stripe_price')
    .where({ stripe_price_id: stripePriceId })
    .del();

  await knex('stripe_price')
    .where({ stripe_price_id: stripePriceId })
    .del();
  return numberDeleted;
};

export const deleteItem = async body => {
  const { stripeProductId, stripePriceId } = body;

  const numberPriceDeleted = await deletePrice(stripePriceId);
  const numberProductDeleted = await deleteProduct(stripeProductId);

  if (numberPriceDeleted && numberProductDeleted) {
    return true;
  }
  return false;
};
