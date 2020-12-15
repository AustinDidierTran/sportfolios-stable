import React from 'react';

import isEqual from 'lodash/isEqual';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '../../MUI';
import { Icon } from '../../Custom';

import { useApiRoute } from '../../../hooks/queries';
import { useTranslation } from 'react-i18next';
import { InputAdornment } from '@material-ui/core';

export default function CustomAutocomplete(props) {
  const { t } = useTranslation();
  const {
    formik,
    inputProps = {},
    namespace,
    onChange,
    optionsRoute,
    type,
    icon,
    iconColor,
    ...otherProps
  } = props;

  const { response: options } = useApiRoute(optionsRoute, {
    defaultValue: [],
  });

  const handleChange = (...args) => {
    const [, { value } = {}] = args;

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
      getOptionSelected={isEqual}
      clearOnEscape
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
            placeholder={t('search_sportfolios')}
            inputProps={{
              ...params.inputProps,
              classes: inputProps.classes,
              autoComplete: 'new-password',
            }}
            InputProps={{
              ...params.InputProps,
              ...inputProps.InputProps,
              disableUnderline: true,

              startAdornment: (
                <>
                  {icon ? (
                    <InputAdornment>
                      <Icon icon={icon} color={iconColor} />
                    </InputAdornment>
                  ) : (
                    <></>
                  )}
                </>
              ),
            }}
          />
        );
      }}
      {...otherProps}
      onChange={handleChange}
    />
  );
}
