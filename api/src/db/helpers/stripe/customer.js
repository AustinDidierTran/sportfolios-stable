const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../../connection');
const {
  stripeErrorLogger,
  stripeLogger,
} = require('../../../server/utils/logger');

const getCustomerId = async userId => {
  const [{ customer_id = '' } = {}] = await knex
    .select('customer_id')
    .from('stripe_customer')
    .where('user_id', userId);
  return customer_id;
};

const getCustomer = async userId => {
  const [customer] = await knex('stripe_customer')
    .select('*')
    .where({ user_id: userId });
  return customer;
};

const createCustomer = async (body, userId) => {
  const { customer } = body;
  stripe.customers.create(
    { ...customer, metadata: { user_id: userId } },
    async function(err, customer) {
      if (customer) {
        await knex('stripe_customer').insert({
          user_id: userId,
          customer_id: customer.id,
          informations: customer,
        });
      }
      if (err) {
        stripeErrorLogger('Error when creating customer');
      }
    },
  );

  return getCustomerId(userId);
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
  const paymentMethods = await knex('stripe_payment_method').where(
    'user_id',
    userId,
  );

  return paymentMethods;
};

const getPaymentMethodId = async userId => {
  const [{ payment_method_id } = {}] = await knex
    .select('payment_method_id')
    .from('stripe_payment_method')
    .where('user_id', userId);
  return payment_method_id;
};

const createPaymentMethod = async (body, userId) => {
  const { payment_method } = body;
  stripe.paymentMethods.create(payment_method, async function(
    err,
    paymentMethod,
  ) {
    if (paymentMethod) {
      stripeLogger('Created Payment Method', paymentMethod.id);
      await knex('stripe_payment_method').insert({
        user_id: userId,
        payment_method_id: paymentMethod.id,
      });
    }
    if (err) {
      stripeErrorLogger('Error when creating payment method');
    }
  });

  return getPaymentMethodId(userId);
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
