import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useTranslation } from 'react-i18next';
import { FormHelperText } from '@material-ui/core';
import { SELECT_ENUM } from '../../../../../common/enums';
import { Typography } from '../../MUI';

export default function CustomSelect(props) {
  const { t } = useTranslation();
  const {
    className,
    error,
    formik,
    label,
    namespace,
    onChange,
    options,
    showtextifonlyoneoption = 'false',
    value: valueProp,
  } = props;

  //Value cannot be undefined so it is set to an empty string by default
  let value = '';
  if (formik) {
    value = formik.values[namespace];
  } else if (valueProp) {
    value = valueProp;
  }

  const handleChange = (event, ...args) => {
    if (formik) {
      formik.handleChange(event, ...args);
    }

    if (onChange) {
      onChange(event.target.value);
    }
  };

  if (showtextifonlyoneoption === 'true' && options.length) {
    return (
      <Typography align="left">{`${label}: ${options[0].display}`}</Typography>
    );
  }

  return (
    <FormControl className={className} style={{ width: '100%' }}>
      <InputLabel>{label}</InputLabel>
      <Select
        id={namespace}
        name={namespace}
        {...props}
        error={Boolean((formik && formik.errors[namespace]) || error)}
        value={
          !options?.length && value === SELECT_ENUM.ALL ? '' : value
        }
        onChange={handleChange}
      >
        <MenuItem disabled value="">
          {label}
        </MenuItem>
        {options && options.length ? (
          options.map(option => (
            <MenuItem value={option.value} key={option.value}>
              {option.display || t(option.displayKey)}
            </MenuItem>
          ))
        ) : (
          <div />
        )}
      </Select>
      <FormHelperText
        error={Boolean((formik && formik.errors[namespace]) || error)}
      >
        {(formik && formik.errors[namespace]) || error}
      </FormHelperText>
    </FormControl>
  );
}
