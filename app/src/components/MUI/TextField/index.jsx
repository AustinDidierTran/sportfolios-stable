import React from 'react';
import TextField from '@material-ui/core/TextField';

// See native documentation here: https://material-ui.com/components/text-fields/

export default function CustomTextField(props) {
  const { formik, namespace } = props;

  console.log('formik', formik);


  return <TextField
    id={namespace}
    name={namespace}
    error={formik && formik.errors[namespace]}
    helperText={formik && formik.errors[namespace]}
    onChange={formik && formik.handleChange}
    value={formik && formik.values[namespace]}
    {...props} />;
}
