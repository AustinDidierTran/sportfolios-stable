import React from 'react';
import TableBody from '@material-ui/core/TableBody';

export default function CustomTableBody(props) {
  return <TableBody {...props}>{props.children}</TableBody>;
}
