import React from 'react';

import Input from '../../Input';
import { TableCell } from '../../../MUI';
import { Select } from '../../../Custom';

export default function CellRenderer(props) {
  const {
    error,
    header: { display, value, type = 'text', items },
    index,
    ...values
  } = props;

  switch (type) {
    case 'number':
      return (
        <TableCell key={index}>
          <Input
            label={display}
            namespace={value}
            error={error}
            type="number"
            {...values.inputProps}
          />
        </TableCell>
      );
    case 'select':
      return (
        <TableCell key={index}>
          <Select
            label={display}
            namespace={value}
            options={items}
            value={value}
          />
        </TableCell>
      );
    default:
  }

  return (
    <TableCell key={index}>
      <Input
        label={display}
        namespace={value}
        error={error}
        type={type}
        {...values.inputProps}
      />
    </TableCell>
  );
}
