import React from 'react';

import { TableRow, TableCell, IconButton } from '../../../MUI';

// Buttons
import Check from '@material-ui/icons/Check';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

export default function DataRow(props) {
  const { datum, headers } = props;

  return (
    <TableRow>
      {headers.map((h, index) => <TableCell key={index}>{datum[h.value]}</TableCell>)}
      <TableCell>
        <IconButton size="small">
          <Edit size="small" />
        </IconButton>
        <IconButton size="small">
          <Check size="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}