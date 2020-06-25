const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../../connection');

const getCustomerId = async userId => {
  const [{ customer_id } = {}] = await knex
    .select('customer_id')
    .from('stripe_customer')
    .where('user_id', userId);
  return customer_id;
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
        });
      }
      if (err) {
        /* eslint-disable-next-line */
        console.log('Error when creating customer');
      }
    },
  );

  return getCustomerId(userId);
};

const getOrCreateCustomer = async (body, userId) => {
  // Create Payment Method
  if (await getCustomerId(userId)) {
    /* eslint-disable-next-line */
    console.log('Customer already exists');
    return getCustomerId(userId);
  } else {
    /* eslint-disable-next-line */
    console.log('Creating customer ...');
    return await createCustomer(body, userId);
  }
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
      /* eslint-disable-next-line */
      console.log('Created Payment Method', paymentMethod.id);
      await knex('stripe_payment_method').insert({
        user_id: userId,
        payment_method_id: paymentMethod.id,
      });
    }
    if (err) {
      /* eslint-disable-next-line */
      console.log('Error when creating payment method');
    }
  });

  return getPaymentMethodId(userId);
};

const addPaymentMethodCustomer = async (body, userId) => {
  const { payment_method_id } = body;
  const customerId = await getCustomerId(userId);

  stripe.paymentMethods.attach(
    payment_method_id,
    { customer: customerId },
    async function(err, paymentMethod) {
      if (paymentMethod) {
        /* eslint-disable-next-line */
        console.log(
          `PaymentMethod successfully attached to customer ${customerId}`,
        );
      }
      if (err) {
        /* eslint-disable-next-line */
        console.log(
          `Error when attaching payment method to customer ${customerId}`,
        );
      }
    },
  );

  return getCustomerId(userId);
};

const removePaymentMethodCustomer = async body => {
  const { payment_method_id } = body;
  stripe.paymentMethods.detach(payment_method_id, async function(
    err,
    paymentMethod,
  ) {
    if (paymentMethod) {
      /* eslint-disable-next-line */
      console.log(
        `PaymentMethod successfully detached from customer`,
      );
    }
    if (err) {
      /* eslint-disable-next-line */
      console.log(`Error failed to detach from customer`);
    }
  });
};

module.exports = {
  getCustomerId,
  createCustomer,
  getOrCreateCustomer,
  getPaymentMethodId,
  createPaymentMethod,
  addPaymentMethodCustomer,
  removePaymentMethodCustomer,
};
