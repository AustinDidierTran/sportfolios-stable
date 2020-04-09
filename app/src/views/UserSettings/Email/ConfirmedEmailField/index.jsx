import React from 'react';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Delete from '@material-ui/icons/Delete';
import { IconButton, TextField } from '../../../../components/MUI';

import styles from './ConfirmedEmailField.module.css';
import { Tooltip } from '@material-ui/core';

export default function EmailField(props) {
  const {
    email: { email, confirmed_email_at },
    isDeletable,
  } = props;

  return (
    <div className={styles.container}>
      <TextField
        disabled
        value={email}
        fullWidth
        className={styles.TextField}
      />
      <span className={styles.confirmedIcon}>
        <Tooltip title={`Confirmed on ${confirmed_email_at}.`}>
          <CheckCircle color="primary" size="small" />
        </Tooltip>
      </span>
      {isDeletable ? (
        <span className={styles.deleteIcon}>
          <Tooltip title="Delete this email from this account">
            <IconButton size="small">
              <Delete size="small" />
            </IconButton>
          </Tooltip>
        </span>
      ) : (
        <></>
      )}
    </div>
  );
}
