import React from 'react';
import TableHead from '@material-ui/core/TableHead';

export default function CustomTableHead(props) {
  return <TableHead {...props}>{props.children}</TableHead>;
}
