import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Teams.module.css';
import { TextField } from '../../../../../components/MUI';
import { IconButton, Tooltip } from '@material-ui/core';
import Add from '@material-ui/icons/AddCircle';

export default function Teams(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <TextField
        namespace="Teams"
        label={t('new_team')}
        className={styles.TextField}
      />
      <Tooltip title="Add new team to your account">
        <IconButton size="small" type="submit">
          <Add size="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
