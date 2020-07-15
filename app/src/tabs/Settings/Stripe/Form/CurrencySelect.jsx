/* eslint-disable no-use-before-define */
import React, { useMemo } from 'react';
import { Autocomplete } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
// const currencies = require('currency-codes/data');

const whitelistedCurrencies = ['CAD'];
const currencies = [
  {
    currency: 'canadian_dollar',
    code: 'CAD',
  },
];

export default function CurrencySelect(props) {
  const { t } = useTranslation();
  const { formik } = props;

  const content = option => (
    <React.Fragment>{option.display}</React.Fragment>
  );

  const options = useMemo(() =>
    currencies
      .map(
        currency => ({
          display: t(currency.currency),
          value: currency.code,
        }),
        [currencies],
      )
      .filter(currency =>
        whitelistedCurrencies.includes(currency.value),
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
