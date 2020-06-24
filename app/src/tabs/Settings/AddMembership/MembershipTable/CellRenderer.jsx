import React from 'react';

import Input from '../../../../components/Custom/Input';
import { TableCell } from '../../../../components/MUI';
import { Select } from '../../../../components/Custom';

export default function CellRenderer(props) {
  const {
    error,
    header: {
      display,
      value,
      type = 'text',
      items,
      onChange,
      disabled,
    },
    index,
    ...values
  } = props;

  const handleChange = event => {
    onChange(event);
    values.changeDefault(event.target.value);
  };

  if (type === 'select') {
    return (
      <TableCell key={index}>
        <Select
          label={display}
          namespace={value}
          options={items}
          onChange={handleChange}
          error={error}
        />
      </TableCell>
    );
  } else {
    return (
      <TableCell key={index}>
        <Input
          label={display}
          namespace={value}
          error={error}
          type={type}
          {...values.inputProps}
          disabled={disabled}
        />
      </TableCell>
    );
  }
}
