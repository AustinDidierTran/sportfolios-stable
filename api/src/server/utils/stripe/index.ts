import Stripe from 'stripe';
import { ERROR_ENUM } from '../../../../../common/errors';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

export const createCustomer = async (body: {
  line1: string;
  line2: string;
  city: string;
  country: string;
  postalCode: string;
  state: string;
  email: string;
  name: string;
  userId: string;
  paymentMethodId: string;
  phoneNumber: string;
}): Promise<Stripe.Customer> => {
  const {
    line1,
    line2,
    city,
    country,
    postalCode,
    state,
    email,
    name,
    userId,
    paymentMethodId,
    phoneNumber,
  } = body;

  const params = {
    address: {
      line1,
      line2,
      city,
      country,
      // eslint-disable-next-line
      postal_code: postalCode,
      state,
    },
    email,
    name,
    // eslint-disable-next-line
    metadata: { user_id: userId },
    // eslint-disable-next-line
    payment_method: paymentMethodId,
    phone: phoneNumber,
  };

  const customer = await stripe.customers.create(params);

  if (!customer) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  return customer;
};

export const createPaymentMethod = async (body: {
  stripeTokenId: string;
  city: string;
  country: string;
  email: string;
  line1: string;
  line2: string;
  postalCode: string;
  state: string;
  name: string;
  phone: string;
}): Promise<Stripe.PaymentMethod> => {
  const {
    stripeTokenId,
    city,
    country,
    line1,
    line2,
    postalCode,
    state,
    name,
    email,
    phone,
  } = body;

  const params: Stripe.PaymentMethodCreateParams = {
    type: 'card',
    // eslint-disable-next-line
    billing_details: {
      address: {
        city,
        country,
        line1,
        line2,
        // eslint-disable-next-line
        postal_code: postalCode,
        state,
      },
      email,
      name,
      phone,
    },
    card: { token: stripeTokenId },
  };

  const paymentMethod = await stripe.paymentMethods.create(params);

  if (!paymentMethod) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  return paymentMethod;
};
