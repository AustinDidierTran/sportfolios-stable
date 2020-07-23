import React from 'react';

import { Paper } from '../../../components/Custom';
import { CircularProgress } from '@material-ui/core';
import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner(props) {
  const { isComponent } = props;

  if (isComponent) {
    return <CircularProgress className={styles.component} />;
  }

  return (
    <Paper>
      <CircularProgress className={styles.page} />
    </Paper>
  );
}
