import React from 'react';
import TableCell from '@material-ui/core/TableCell';

export default function CustomTableCell(props) {
  return <TableCell {...props}>{props.children}</TableCell>;
}
