/* eslint-disable no-use-before-define */
import React, { useMemo } from 'react';
import { Autocomplete } from '../../../../components/Custom';
const currencies = require('currency-codes/data');

export default function CurrencySelect(props) {
  const { formik } = props;

  const content = option => (
    <React.Fragment>{option.display}</React.Fragment>
  );

  const options = useMemo(() =>
    currencies.map(
      currency => ({
        display: currency.currency,
        value: currency.code,
      }),
      [currencies],
    ),
  );

  return (
    <Autocomplete
      formik={formik}
      options={options}
      type="currency"
      renderOption={content}
      namespace="currency"
    />
  );
}
