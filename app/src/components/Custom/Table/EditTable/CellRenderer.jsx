import React from 'react';

import { TableCell, TextField } from '../../../MUI';

export default function CellRenderer(props) {
  const { error, header, index, ...values } = props;

  switch (header.type) {
    case 'number':
      return (<TableCell key={index}>
        <TextField
          label={header.display}
          namespace={header.value}
          error={error}
          type="number"
          {...values}
        />
      </TableCell>)

  }

  return (<TableCell key={index}>
    <TextField
      label={header.display}
      namespace={header.value}
      error={error}
      {...values}
    />
  </TableCell>)
}