import stripeLib from 'stripe';

const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);

export const updatePayouts = async () => {
  const reportType = await stripe.reporting.reportTypes.retrieve(
    'payout_reconciliation.itemized.5',
    {
      stripeAccount: 'acct_1Hz5uKR9yjqEhKyN',
    },
  );

  console.log(123, reportType);

  const reportRun = await stripe.reporting.reportRuns.create(
    {
      report_type: 'payout_reconciliation.itemized.5',
      parameters: {
        interval_start: reportType.data_available_start,
        interval_end: reportType.data_available_end,
        // timezone: 'America/Los_Angeles',
        columns: ['created', 'reporting_category', 'net'],
      },
    },
    {
      stripeAccount: 'acct_1Hz5uKR9yjqEhKyN',
    },
  );

  console.log({ reportRun });

  return;
  const payouts = await stripe.transfers.list({});

  const payout = await stripe.transfers.retrieve(null, {
    stripeAccount: 'acct_1Hz5uKR9yjqEhKyN',
  });

  console.log('payouts', payouts);
  payouts.data.forEach(payout => {
    console.log('metadata', payout.metadata);
    console.log('period', payout.period);
    console.log('price', payout.price);
  });

  console.log('singular payout', payout);
};
