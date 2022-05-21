import stripeLib from 'stripe';
import axios from 'axios';

import dotenv from 'dotenv';
import { STRIPE_REPORT_TYPES } from '../../../typescript/stripe';
import { ERROR_ENUM } from '../../../../../common/errors';
dotenv.config();

// eslint-disable-next-line
// @ts-ignore
const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);

export const createReportRun = async (
  stripeAccount: string,
  type: STRIPE_REPORT_TYPES,
  columns?: string[],
): Promise<string> => {
  const reportType = await stripe.reporting.reportTypes.retrieve(type, {
    stripeAccount,
  });

  const reportRun = await stripe.reporting.reportRuns.create(
    {
      // eslint-disable-next-line
      report_type: reportType.id,
      parameters: {
        // eslint-disable-next-line
        interval_start: reportType.data_available_start,
        // eslint-disable-next-line
        interval_end: reportType.data_available_end,
        columns,
      },
    },
    { stripeAccount },
  );

  return reportRun.id;
};

export const getReportRun = async (
  reportRunId: string,
  stripeAccount: string,
): Promise<any> => {
  try {
    const reportRun = await stripe.reporting.reportRuns.retrieve(reportRunId, {
      stripeAccount,
    });

    if (!reportRun.result) {
      throw new Error(ERROR_ENUM.ERROR_OCCURED);
    }

    const res = await axios(reportRun.result.url, {
      auth: {
        username: process.env.STRIPE_SECRET_KEY,
        password: '',
      },
      headers: { 'Stripe-Account': stripeAccount },
    });

    return res.data
      .split('\n')
      .map((d: string) =>
        d.split(',').map((s: string) => s.replace(/"/gi, '')),
      );
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
};
