const { BUSINESS_TYPE_ENUM } = require('./enums');

const dobFormatter = dob => {
  if (!dob) {
    return null;
  }
  const dobArray = dob.split('-');
  return {
    year: +dobArray[0],
    month: +dobArray[1],
    day: +dobArray[2],
  };
};

const accountParamsFactory = params => {
  const {
    business_type,
    city,
    country,
    dob,
    email,
    external_account,
    first_name,
    ip,
    last_name,
    line1,
    postal_code,
    state,
  } = params;

  if (!business_type) {
    return {
      requested_capabilities: ['card_payments', 'transfers'],
      type: 'custom',
    };
  }

  if (business_type === BUSINESS_TYPE_ENUM.INDIVIDUAL) {
    return {
      business_type,
      individual: {
        address: {
          city,
          country,
          line1,
          postal_code,
          state,
        },
        dob: dobFormatter(dob),
        first_name,
        last_name,
      },
      type: 'custom',
      country,
      email,
      external_account,
      requested_capabilities: ['card_payments', 'transfers'],
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip,
      },
    };
  } else if (business_type === BUSINESS_TYPE_ENUM.NON_PROFIT) {
    // define non profit
  } else {
    throw 'Unsupported business type';
  }
};

module.exports = { accountParamsFactory };
