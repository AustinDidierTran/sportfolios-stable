import React from 'react';
import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@material-ui/core';

export default function CustomRadioGroup(props) {
  const { namespace, options, title, value, onChange } = props;

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{title}</FormLabel>
      <RadioGroup
        aria-label={namespace}
        name={namespace}
        value={value}
        onChange={onChange}
      >
        {options.map((option, index) => (
          <FormControlLabel
            value={option.value}
            label={option.display}
            control={<Radio color="primary" />}
            key={index}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
