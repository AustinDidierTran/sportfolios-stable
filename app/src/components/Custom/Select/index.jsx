import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useTranslation } from 'react-i18next';

export default function CustomSelect(props) {
  const { t } = useTranslation();
  const {
    className,
    formik,
    label,
    namespace,
    onChange,
    options,
  } = props;

  const handleChange = (event, ...args) => {
    if (formik) {
      formik.handleChange(event, ...args);
    }

    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <FormControl className={className} style={{ width: '100%' }}>
      <InputLabel>{label}</InputLabel>
      <Select
        id={namespace}
        name={namespace}
        value={formik && formik.values[namespace]}
        {...props}
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
          <></>
        )}
      </Select>
    </FormControl>
  );
}
