import React from 'react';
import TableRow from '@material-ui/core/TableRow';

export default function CustomTableRow(props) {
  return <TableRow {...props}>{props.children}</TableRow>;
}
