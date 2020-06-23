import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// See native documentation here: https://material-ui.com/components/text-fields/

export default function CustomTextField(props) {
  const { disabled, error, formik, namespace, onChange } = props;

  const handleChange = (event, ...args) => {
    if (formik) {
      formik.handleChange(event, ...args);
    }

    if (onChange) {
      onChange(event.target.value);
    }
  };

  return disabled ? (
    <Typography>{props.value}</Typography>
  ) : (
    <TextField
      id={namespace}
      name={namespace}
      error={Boolean((formik && formik.errors[namespace]) || error)}
      helperText={(formik && formik.errors[namespace]) || error}
      value={formik && formik.values[namespace]}
      {...props}
      onChange={handleChange}
    />
  );
}
