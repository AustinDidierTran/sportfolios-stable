import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function CustomCheckBox(props) {
  const { checked, onChange, label, color, name } = props;

  const handleChange = event => {
    onChange(event.target.checked);
  };
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={handleChange}
          color={color || 'primary'}
          name={name}
        />
      }
      label={label}
    />
  );
}
