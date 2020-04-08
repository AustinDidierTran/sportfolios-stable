import React from 'react';
import TextField from '@material-ui/core/TextField';

// See native documentation here: https://material-ui.com/components/text-fields/

export default function CustomTextField(props) {
  const { error, formik, namespace } = props;

  return <TextField
    id={namespace}
    name={namespace}
    error={formik && formik.errors[namespace] || error}
    helperText={formik && formik.errors[namespace] || error}
    onChange={formik && formik.handleChange}
    value={formik && formik.values[namespace]}
    {...props} />;
}
