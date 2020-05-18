import React from 'react';
import Delete from '@material-ui/icons/Delete';
import Error from '@material-ui/icons/Error';
import { TextField } from '../../../../components/MUI';

import styles from './UnconfirmedEmailField.module.css';
import { IconButton, Tooltip } from '@material-ui/core';

export default function UnconfirmedEmailField(props) {
  const {
    email: { email },
  } = props;

  return (
    <div className={styles.container}>
      <TextField
        disabled
        value={email}
        fullWidth
        className={styles.TextField}
      />
      <span className={styles.unconfirmedIcon}>
        <Tooltip>
          <IconButton color="secondary" size="small">
            <Error color="secondary" />
          </IconButton>
        </Tooltip>
      </span>
      <span className={styles.deleteIcon}>
        <Tooltip title="Delete this email from this account">
          <IconButton size="small">
            <Delete size="small" />
          </IconButton>
        </Tooltip>
      </span>
    </div>
  );
}
