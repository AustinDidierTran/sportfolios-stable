import React from 'react';
import EditTable from './EditTable';
import ViewTable from './ViewTable';

export default function Table(props) {
  const { mode } = props;

  if (mode === 'edit') {
    return <EditTable {...props}>{props.children}</EditTable>
  }

  return <ViewTable {...props}>{props.children}</ViewTable>
}
