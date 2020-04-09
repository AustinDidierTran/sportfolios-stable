import React from 'react';
import Table from '@material-ui/core/Table';

export default function CustomTable(props) {
  return <Table {...props}>{props.children}</Table>;
}
