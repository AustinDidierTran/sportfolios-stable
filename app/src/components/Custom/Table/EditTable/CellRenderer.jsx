import React from 'react';

import Input from '../../Input';
import { TableCell } from '../../../MUI';

export default function CellRenderer(props) {
  const {
    error,
    header: { display, value, type = 'text' },
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
