/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
var currencies = require('currency-codes/data');

export default function CurrencySelect(props) {
  const { formik } = props;

  const onChange = (...args) => {
    console.log(args);
    const newValue = args[1].code;
    formik.setFieldValue('currency', newValue);
  };

  const content = option => (
    <React.Fragment>{option.code}</React.Fragment>
  );

  return (
    <Autocomplete
      id="currency-select"
      onChange={onChange}
      options={currencies}
      autoHighlight
      getOptionLabel={option => option.code}
      renderOption={content}
      renderInput={params => (
        <TextField
          {...params}
          namespace="currency"
          formik={formik}
          type="currency"
          label="Currency"
          fullWidth
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
