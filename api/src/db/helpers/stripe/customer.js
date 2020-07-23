const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../../connection');
const {
  stripeErrorLogger,
  stripeLogger,
} = require('../../../server/utils/logger');
const { ERROR_ENUM } = require('../../../../../common/errors');
const { PAYMENT_METHOD_TYPE_ENUM } = require('./enums');

const getCustomerId = async paymentId => {
  const [{ customer_id = '' } = {}] = await knex
    .select('customer_id')
    .from('stripe_customer')
    .where('payment_method_id', paymentId);
  return customer_id;
};

const getCustomer = async userId => {
  const [customer] = await knex('stripe_customer')
    .select('*')
    .where({ user_id: userId });
  return customer;
};

const createCustomer = async (body, userId, paymentMethod) => {
  const { id: paymentMethodId, last4 } = paymentMethod;
  const params = {
    address: {
      line1: body.line1,
      line2: body.line2,
      city: body.city,
      country: body.country,
      postal_code: body.postalCode,
      state: body.state,
    },
    email: body.email,
    name: body.name,
    metadata: { user_id: userId },
    payment_method: paymentMethodId,
    phone: body.phoneNumber,
  };

  console.log('Creating customer with params', params);

  const customer = await stripe.customers.create(params);

  console.log({ customer });
  if (!customer) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  try {
    await knex('stripe_customer').insert({
      user_id: userId,
      customer_id: customer.id,
      informations: customer,
      payment_method_id: paymentMethodId,
      last4,
    });
  } catch (err) {
    stripeErrorLogger(
      `Customer with id ${customer.id} already exists, taking it back`,
    );
    console.log({ err });
  }
  return customer.id;
};

const getOrCreateCustomer = async (body, userId) => {
  // Create Payment Method
  if (await getCustomerId(userId)) {
    stripeLogger('Customer already exists');
    return getCustomerId(userId);
  } else {
    stripeLogger('Creating customer ...');
    return await createCustomer(body, userId);
  }
};

const getPaymentMethods = async userId => {
  const paymentMethods = await knex('stripe_customer').where(
    'user_id',
    userId,
  );
  return paymentMethods;
};

const getPaymentMethodId = async userId => {
  const [{ payment_method_id } = {}] = await knex
    .select('payment_method_id')
    .from('stripe_customer')
    .where('user_id', userId);
  return payment_method_id;
};

const createPaymentMethod = async body => {
  const { stripeToken } = body;

  const params = {
    type: PAYMENT_METHOD_TYPE_ENUM.CARD,
    billing_details: {
      address: {
        city: body.city,
        country: body.country,
        line1: body.line1,
        line2: body.line2,
        postal_code: body.postalCode,
        state: body.state,
      },
      email: body.email,
      name: body.name,
      phone: body.phone,
    },
    card: { token: stripeToken.id },
  };

  console.log({ params });

  let paymentMethod;
  try {
    paymentMethod = await stripe.paymentMethods.create(params);
  } catch (err) {
    console.log({ err });
  }

  console.log({ paymentMethod });

  if (!paymentMethod) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  console.log('Created Payment Method', paymentMethod.id);

  stripeLogger('Created Payment Method', paymentMethod.id);
  return { id: paymentMethod.id, last4: paymentMethod.card.last4 };
};

const addPaymentMethodCustomer = async (body, userId) => {
  const { payment_method_id: paymentMethodId } = body;

  const customerId = await getCustomerId(userId);

  const setupIntentParams = {
    confirm: true,
    customer: customerId,
    payment_method: paymentMethodId,
    payment_method_types: ['card'],
    metadata: {},
  };

  try {
    await stripe.setupIntents.create(setupIntentParams);
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    stripeLogger(`Payment method attached`);

    const customer = await stripe.customers.retrieve(customerId);
    await knex('stripe_customer')
      .update({ informations: customer })
      .where({ user_id: userId });

    return getCustomerId(userId);
  } catch (err) {
    stripeErrorLogger('AttachPaymentMethod error', err);
    throw err;
  }
};

const removePaymentMethodCustomer = async body => {
  const { payment_method_id } = body;
  stripe.paymentMethods.detach(payment_method_id, async function(
    err,
    paymentMethod,
  ) {
    if (paymentMethod) {
      stripeLogger(
        `PaymentMethod successfully detached from customer`,
      );
    }
    if (err) {
      stripeErrorLogger(`Error failed to detach from customer`);
    }
  });
};

module.exports = {
  addPaymentMethodCustomer,
  createCustomer,
  createPaymentMethod,
  getCustomer,
  getCustomerId,
  getOrCreateCustomer,
  getPaymentMethodId,
  getPaymentMethods,
  removePaymentMethodCustomer,
};
