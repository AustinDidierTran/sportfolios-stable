import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Typography } from '..';
// See native documentation here: https://material-ui.com/components/text-fields/

export default function CustomTextField(props) {
  const {
    disabled,
    error,
    formik,
    hidden,
    namespace,
    onChange,
    color,
    variant,
    formikDisabled,
    ...otherProps
  } = props;

  const handleChange = (event, ...args) => {
    if (formik) {
      formik.handleChange(event, ...args);
    }

    if (onChange) {
      onChange(event.target.value);
    }
  };

  if (hidden) {
    return <></>;
  }

  if (disabled) {
    return (
      <Typography color={color} variant={variant} {...props}>
        {props.value || props.defaultValue}
      </Typography>
    );
  }

  return (
    <TextField
      id={namespace}
      name={namespace}
      error={Boolean((formik && formik.errors[namespace]) || error)}
      helperText={(formik && formik.errors[namespace]) || error}
      value={formik && formik.values[namespace]}
      color={color}
      variant={variant}
      {...otherProps}
      onChange={handleChange}
      disabled={formikDisabled}
    />
  );
}
