import React from 'react';

import _ from 'lodash';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '../../MUI';

import { useApiRoute } from '../../../hooks/queries';
import { useTranslation } from 'react-i18next';

export default function CustomAutocomplete(props) {
  const { t } = useTranslation();
  const {
    formik,
    inputProps,
    namespace,
    onChange,
    optionsRoute,
    type,
  } = props;

  const options = useApiRoute(optionsRoute, { defaultValue: [] });

  const handleChange = (...args) => {
    const [, { value }] = args;

    if (!formik && !onChange) {
      /* eslint-disable-next-line */
      console.error(
        'Handle Change on Custom Autocomplete does nothing',
      );
    }

    if (formik) {
      formik.setFieldValue(namespace, value);
    }

    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Autocomplete
      autoHighlight
      getOptionLabel={option => option.display}
      options={options}
      getOptionSelected={_.isEqual}
      renderInput={params => {
        return (
          <TextField
            {...params}
            {...inputProps}
            onChange={onChange}
            namespace={namespace}
            formik={formik}
            type={type}
            label={t(namespace)}
            fullWidth
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
          />
        );
      }}
      {...props}
      onChange={handleChange}
    />
  );
}
