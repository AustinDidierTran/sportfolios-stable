import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export default function CustomSelect(props) {
  const { formik, label, namespace, options } = props;

  return (
    <FormControl style={{ width: '100%' }}>
      <InputLabel>{label}</InputLabel>
      <Select
        id={namespace}
        name={namespace}
        value={formik && formik.values[namespace]}
        onChange={formik && formik.handleChange}
        {...props}
      >
        <MenuItem disabled value="">
          {label}
        </MenuItem>
        {options && options.length ? (
          options.map(option => (
            <MenuItem value={option.value} key={option.value}>
              {option.display}
            </MenuItem>
          ))
        ) : (
          <></>
        )}
      </Select>
    </FormControl>
  );
}
