import React from 'react';
import EditTable from './EditTable';
import ViewTable from './ViewTable';
import styles from './Table.module.css';

export default function Table(props) {
  const { mode } = props;

  if (mode === 'edit') {
    return (
      <EditTable className={styles.table} {...props}>
        {props.children}
      </EditTable>
    );
  }

  return <ViewTable {...props}>{props.children}</ViewTable>;
}
